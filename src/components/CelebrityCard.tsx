import { Star, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Celebrity } from '@/data/celebrities';

interface CelebrityCardProps {
  celebrity: Celebrity;
  onViewDetails: (id: string) => void;
}

export const CelebrityCard = ({ celebrity, onViewDetails }: CelebrityCardProps) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'booked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Limited';
      case 'booked': return 'Booked';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-card border-border/50">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={celebrity.image}
            alt={celebrity.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className={`${getAvailabilityColor(celebrity.availability)} text-white border-0`}
            >
              {getAvailabilityText(celebrity.availability)}
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {celebrity.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">{celebrity.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{celebrity.rating}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {celebrity.description}
          </p>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>${celebrity.hourlyRate.toLocaleString()}/hour</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{celebrity.totalBookings} bookings</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {celebrity.specialties.slice(0, 2).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {celebrity.specialties.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{celebrity.specialties.length - 2} more
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={() => onViewDetails(celebrity.id)}
            className="w-full"
            disabled={celebrity.availability === 'booked'}
          >
            {celebrity.availability === 'booked' ? 'Currently Booked' : 'View Details & Book'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};