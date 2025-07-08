import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { celebrities } from '@/data/celebrities';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventType: '',
    guestCount: '',
    specialRequests: '',
    contactName: '',
    contactEmail: user?.email || '',
    contactPhone: '',
  });
  
  const celebrity = celebrities.find(c => c.id === id);
  const packageId = searchParams.get('package') || 'standard';
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  if (!celebrity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Celebrity Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const packages = {
    basic: {
      name: 'Basic Meet & Greet',
      duration: '30 minutes',
      price: celebrity.hourlyRate * 0.5,
      features: ['Personal meet & greet', 'Photo opportunity', 'Autograph signing']
    },
    standard: {
      name: 'Standard Appearance',
      duration: '1 hour',
      price: celebrity.hourlyRate,
      features: ['Personal appearance', 'Meet & greet', 'Photos & autographs', 'Brief Q&A session']
    },
    premium: {
      name: 'Premium Event',
      duration: '2 hours',
      price: celebrity.hourlyRate * 1.8,
      features: ['Extended appearance', 'Interactive session', 'Professional photos', 'Social media mentions', 'Custom content']
    }
  };

  const selectedPackage = packages[packageId as keyof typeof packages];
  const totalAmount = selectedPackage.price;

  const steps = [
    { number: 1, title: 'Event Details', icon: Calendar },
    { number: 2, title: 'Contact Info', icon: User },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: Check }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'usdt' | 'btc' | 'eth'>('bank_transfer');
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: '',
    accountNumber: '', 
    cryptoAddress: ''
  });

  const handlePayment = async () => {
    if (!user) return;

    // Validate payment details based on method
    if (paymentMethod === 'bank_transfer' && (!paymentDetails.bankName || !paymentDetails.accountNumber)) {
      toast({
        title: "Payment Details Required",
        description: "Please provide bank details for transfer.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod !== 'bank_transfer' && !paymentDetails.cryptoAddress) {
      toast({
        title: "Payment Details Required", 
        description: "Please provide crypto wallet address.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save booking to database
      const bookingData = {
        user_id: user.id,
        celebrity_id: id,
        celebrity_name: celebrity.name,
        package_type: selectedPackage.name,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        event_location: formData.eventLocation,
        event_type: formData.eventType,
        guest_count: parseInt(formData.guestCount),
        special_requests: formData.specialRequests,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        amount: selectedPackage.price * 1.05, // Include platform fee
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        status: 'pending' as const
      };

      const { error } = await supabase.from('bookings').insert(bookingData);

      if (error) throw error;

      setCurrentStep(4);
      toast({
        title: "Booking Submitted!",
        description: "Your booking is pending admin approval.",
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="eventTime">Event Time</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange('eventTime', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="eventLocation">Event Location</Label>
              <Input
                id="eventLocation"
                placeholder="Enter event venue or address"
                value={formData.eventLocation}
                onChange={(e) => handleInputChange('eventLocation', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Input
                  id="eventType"
                  placeholder="e.g., Birthday party, Corporate event"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guestCount">Expected Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  placeholder="Number of guests"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                placeholder="Any special requirements or requests for the event"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="contactName">Full Name</Label>
              <Input
                id="contactName"
                placeholder="Your full name"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="your.email@example.com"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Your phone number"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Celebrity:</span>
                  <span className="font-medium">{celebrity.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{selectedPackage.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{formData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{formData.eventLocation || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Payment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{selectedPackage.name}</span>
                  <span>${selectedPackage.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform fee (5%)</span>
                  <span>${(selectedPackage.price * 0.05).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(selectedPackage.price * 1.05).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { value: 'bank_transfer', label: 'Bank Transfer' },
                    { value: 'usdt', label: 'USDT' },
                    { value: 'btc', label: 'Bitcoin' },
                    { value: 'eth', label: 'Ethereum' }
                  ].map((method) => (
                    <Button
                      key={method.value}
                      variant={paymentMethod === method.value ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod(method.value as any)}
                      className="h-12"
                    >
                      {method.label}
                    </Button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'bank_transfer' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Enter your bank name"
                      value={paymentDetails.bankName}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter your account number"
                      value={paymentDetails.accountNumber}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="cryptoAddress">
                    {paymentMethod.toUpperCase()} Wallet Address
                  </Label>
                  <Input
                    id="cryptoAddress"
                    placeholder={`Enter your ${paymentMethod.toUpperCase()} wallet address`}
                    value={paymentDetails.cryptoAddress}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cryptoAddress: e.target.value }))}
                  />
                </div>
              )}
            </div>
            
            <Button onClick={handlePayment} size="lg" className="w-full">
              Submit Booking
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Your booking will be reviewed by our admin team
            </p>
          </div>
        );
        
      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your booking with {celebrity.name} has been confirmed.
              </p>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-lg text-left max-w-md mx-auto">
              <h4 className="font-semibold mb-3">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono">CB-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Celebrity:</span>
                  <span>{celebrity.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formData.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{formData.eventTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span>{selectedPackage.name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                Back to Home
              </Button>
              <Button onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/celebrity/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {celebrity.name}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isActive 
                      ? 'border-primary text-primary' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-2 mr-4">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px w-12 ${
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div>Booking {celebrity.name}</div>
                  <Badge variant="outline" className="mt-1">
                    {selectedPackage.name}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
              
              {currentStep < 4 && (
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === 3}
                  >
                    {currentStep === 3 ? 'Processing...' : 'Next'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;