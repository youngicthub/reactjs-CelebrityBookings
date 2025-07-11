import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Star, Clock, Users, Instagram, Twitter, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { celebrities } from '@/data/celebrities';
import { useAuth } from '@/contexts/AuthContext';

const CelebrityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  
  const celebrity = celebrities.find(c => c.id === id);
  
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

  const packages = [
    {
      id: 'basic',
      name: 'Basic Meet & Greet',
      duration: '30 minutes',
      price: celebrity.hourlyRate * 0.5,
      features: ['Personal meet & greet', 'Photo opportunity', 'Autograph signing']
    },
    {
      id: 'standard',
      name: 'Standard Appearance',
      duration: '1 hour',
      price: celebrity.hourlyRate,
      features: ['Personal appearance', 'Meet & greet', 'Photos & autographs', 'Brief Q&A session']
    },
    {
      id: 'premium',
      name: 'Premium Event',
      duration: '2 hours',
      price: celebrity.hourlyRate * 1.8,
      features: ['Extended appearance', 'Interactive session', 'Professional photos', 'Social media mentions', 'Custom content']
    }
  ];

  const handleBooking = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!selectedPackage) {
      alert('Please select a booking package');
      return;
    }
    
    navigate(`/booking/${celebrity.id}?package=${selectedPackage}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Celebrities
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Celebrity Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={celebrity.image}
                    alt={celebrity.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="secondary" 
                      className={`${celebrity.availability === 'available' ? 'bg-green-500' : celebrity.availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}
                    >
                      {celebrity.availability === 'available' ? 'Available' : celebrity.availability === 'busy' ? 'Limited' : 'Booked'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{celebrity.name}</h1>
                      <Badge variant="outline" className="mb-2">{celebrity.category}</Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{celebrity.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{celebrity.totalBookings} bookings</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>${celebrity.hourlyRate.toLocaleString()}/hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{celebrity.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {celebrity.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                    <div className="flex gap-4">
                      {celebrity.socialMedia.instagram && (
                        <div className="flex items-center gap-2 text-sm">
                          <Instagram className="w-4 h-4" />
                          <span>{celebrity.socialMedia.instagram}</span>
                        </div>
                      )}
                      {celebrity.socialMedia.twitter && (
                        <div className="flex items-center gap-2 text-sm">
                          <Twitter className="w-4 h-4" />
                          <span>{celebrity.socialMedia.twitter}</span>
                        </div>
                      )}
                      {celebrity.socialMedia.tiktok && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span>{celebrity.socialMedia.tiktok}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Packages */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking Packages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{pkg.name}</h4>
                      <Badge variant="outline">{pkg.duration}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-3">
                      ${pkg.price.toLocaleString()}
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Location negotiable</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Flexible scheduling</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleBooking}
                  className="w-full"
                  size="lg"
                  disabled={celebrity.availability === 'booked'}
                >
                  {celebrity.availability === 'booked' 
                    ? 'Currently Unavailable' 
                    : user 
                    ? 'Book Now' 
                    : 'Sign In to Book'
                  }
                </Button>
                
                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    Sign in required for booking
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrityDetails;