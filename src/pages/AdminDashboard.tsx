import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import CelebrityManagement from '@/components/CelebrityManagement';
import BookingStats from '@/components/admin/BookingStats';
import BookingTable from '@/components/admin/BookingTable';
import BookingModal from '@/components/admin/BookingModal';

interface Booking {
  id: string;
  celebrity_name: string;
  package_type: string;
  event_date: string;
  event_time: string;
  event_location: string;
  event_type: string;
  guest_count: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_notes: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: 'approved' | 'rejected', notes: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status, 
        admin_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
      fetchBookings();
      setSelectedBooking(null);
    }
  };

  const handleManageBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">Booking Management</TabsTrigger>
            <TabsTrigger value="celebrities">Celebrity Management</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <BookingStats bookings={bookings} />
            <BookingTable bookings={bookings} onManageBooking={handleManageBooking} />
            {selectedBooking && (
              <BookingModal
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onUpdateStatus={updateBookingStatus}
              />
            )}
          </TabsContent>

          <TabsContent value="celebrities">
            <CelebrityManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;