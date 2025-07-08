import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, DollarSign } from 'lucide-react';

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

interface BookingTableProps {
  bookings: Booking[];
  onManageBooking: (booking: Booking) => void;
}

const BookingTable = ({ bookings, onManageBooking }: BookingTableProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Celebrity</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.contact_name}</div>
                    <div className="text-sm text-muted-foreground">{booking.contact_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.celebrity_name}</div>
                    <div className="text-sm text-muted-foreground">{booking.package_type}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(booking.event_date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    ${Number(booking.amount).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {formatPaymentMethod(booking.payment_method)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageBooking(booking)}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookingTable;