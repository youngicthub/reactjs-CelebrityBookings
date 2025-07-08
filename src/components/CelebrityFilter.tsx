import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/data/celebrities';

interface CelebrityFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityFilter: (value: string) => void;
}

export const CelebrityFilter = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  availabilityFilter,
  onAvailabilityFilter
}: CelebrityFilterProps) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border/50 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Filter & Search</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search celebrities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Sort By */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="bookings">Most Booked</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Availability Filter */}
        <Select value={availabilityFilter} onValueChange={onAvailabilityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="busy">Limited Availability</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Active Filters */}
      {(selectedCategory !== 'All' || availabilityFilter !== 'all' || searchTerm) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== 'All' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onCategoryChange('All')}>
              {selectedCategory} ×
            </Badge>
          )}
          {availabilityFilter !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onAvailabilityFilter('all')}>
              {availabilityFilter} ×
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onSearchChange('')}>
              "{searchTerm}" ×
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCategoryChange('All');
              onAvailabilityFilter('all');
              onSearchChange('');
            }}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};