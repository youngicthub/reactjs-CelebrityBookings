import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Clock, DollarSign, User } from 'lucide-react';

interface Booking {
  id: string;
  celebrity_name: string;
  package_type: string;
  event_date: string;
  event_time: string;
  event_location: string;
  event_type: string;
  guest_count: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_notes: string;
  created_at: string;
  special_requests: string;
}

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive"
      });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'usdt': return 'USDT';
      case 'btc': return 'Bitcoin';
      case 'eth': return 'Ethereum';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading your bookings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any celebrity bookings yet.
              </p>
              <Button onClick={() => navigate('/')}>
                Browse Celebrities
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {booking.celebrity_name}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{booking.package_type}</span>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${Number(booking.amount).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatPaymentMethod(booking.payment_method)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {new Date(booking.event_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.event_time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{booking.event_location}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.event_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{booking.guest_count} guests</div>
                        <div className="text-sm text-muted-foreground">
                          Expected
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">Special Requests:</div>
                      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {booking.special_requests}
                      </div>
                    </div>
                  )}

                  {booking.admin_notes && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">Admin Notes:</div>
                      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {booking.admin_notes}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>
                      Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    {booking.status === 'pending' && (
                      <span className="text-yellow-600">
                        Waiting for admin approval
                      </span>
                    )}
                    {booking.status === 'approved' && (
                      <span className="text-green-600">
                        Booking confirmed!
                      </span>
                    )}
                    {booking.status === 'rejected' && (
                      <span className="text-red-600">
                        Booking declined
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;