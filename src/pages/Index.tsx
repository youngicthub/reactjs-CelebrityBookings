import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CelebrityCard } from '@/components/CelebrityCard';
import { CelebrityFilter } from '@/components/CelebrityFilter';
import { celebrities } from '@/data/celebrities';

const Index = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const filteredAndSortedCelebrities = useMemo(() => {
    let filtered = celebrities.filter(celebrity => {
      const matchesSearch = celebrity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           celebrity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           celebrity.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || celebrity.category === selectedCategory;
      
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' && celebrity.availability === 'available') ||
                                 (availabilityFilter === 'busy' && celebrity.availability === 'busy');
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.hourlyRate - b.hourlyRate;
        case 'price-high':
          return b.hourlyRate - a.hourlyRate;
        case 'bookings':
          return b.totalBookings - a.totalBookings;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, availabilityFilter]);

  const handleViewDetails = (celebrityId: string) => {
    navigate(`/celebrity/${celebrityId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Celebrity Booking System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect with your favorite celebrities for exclusive events, appearances, and personalized experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="min-w-[140px]">Get Started</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
              Browse Celebrities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Celebrity Booking
              </h1>
              <nav className="hidden md:flex gap-6">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
                  My Bookings
                </Link>
                {userRole === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
              </nav>
            </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button onClick={() => navigate('/my-bookings')} variant="outline">
                  My Bookings
                </Button>
                <Button onClick={signOut} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Book Your Dream Celebrity</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From Hollywood stars to sports legends, find and book the perfect celebrity for your next event
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{celebrities.filter(c => c.availability === 'available').length} Available Now</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{celebrities.filter(c => c.availability === 'busy').length} Limited Availability</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{celebrities.length} Total Celebrities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <CelebrityFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availabilityFilter={availabilityFilter}
          onAvailabilityFilter={setAvailabilityFilter}
        />

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">
            {filteredAndSortedCelebrities.length} Celebrity{filteredAndSortedCelebrities.length !== 1 ? 'ies' : 'y'} Found
          </h3>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedCelebrities.length} of {celebrities.length} celebrities
          </div>
        </div>

        {/* Celebrity Grid */}
        {filteredAndSortedCelebrities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCelebrities.map((celebrity) => (
              <CelebrityCard
                key={celebrity.id}
                celebrity={celebrity}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No celebrities found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setAvailabilityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
