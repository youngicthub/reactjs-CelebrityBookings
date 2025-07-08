import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';

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

interface BookingModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: 'approved' | 'rejected', notes: string) => void;
}

const BookingModal = ({ booking, onClose, onUpdateStatus }: BookingModalProps) => {
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || '');

  const handleUpdateStatus = (status: 'approved' | 'rejected') => {
    onUpdateStatus(booking.id, status, adminNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Manage Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Customer</div>
              <div>{booking.contact_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Celebrity</div>
              <div>{booking.celebrity_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Event Date</div>
              <div>{new Date(booking.event_date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Event Time</div>
              <div>{booking.event_time}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Location</div>
              <div>{booking.event_location}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Amount</div>
              <div>${Number(booking.amount).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Admin Notes</div>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this booking..."
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            {booking.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleUpdateStatus('approved')}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('rejected')}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal;