import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Booking {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount: number;
}

interface BookingStatsProps {
  bookings: Booking[];
}

const BookingStats = ({ bookings }: BookingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookings.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'approved').length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${bookings.reduce((sum, b) => sum + Number(b.amount), 0).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingStats;