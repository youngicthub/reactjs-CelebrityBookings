export interface Celebrity {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'booked';
  specialties: string[];
  socialMedia: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  rating: number;
  totalBookings: number;
}

export const celebrities: Celebrity[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    category: 'Actress',
    image: 'https://cdn.pixabay.com/photo/2018/08/04/20/48/woman-3584435_1280.jpg',
    description: 'Award-winning actress known for her versatile performances in drama and comedy films.',
    hourlyRate: 5000,
    availability: 'available',
    specialties: ['Film Acting', 'Voice Over', 'Brand Endorsements'],
    socialMedia: {
      instagram: '@sarahjohnson',
      twitter: '@sarahj_actress'
    },
    rating: 4.9,
    totalBookings: 127
  },
  {
    id: '2',
    name: 'Marcus Williams',
    category: 'Musician',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    description: 'Grammy-nominated R&B artist and producer with over 10 years in the industry.',
    hourlyRate: 3500,
    availability: 'available',
    specialties: ['Live Performances', 'Studio Recording', 'Music Production'],
    socialMedia: {
      instagram: '@marcuswmusic',
      twitter: '@marcusw_music'
    },
    rating: 4.8,
    totalBookings: 89
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    category: 'Model',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    description: 'International fashion model featured in top magazines and runway shows worldwide.',
    hourlyRate: 2500,
    availability: 'busy',
    specialties: ['Fashion Photography', 'Commercial Shoots', 'Runway Shows'],
    socialMedia: {
      instagram: '@elenamodel',
      tiktok: '@elena_rodriguez'
    },
    rating: 4.7,
    totalBookings: 203
  },
  {
    id: '4',
    name: 'David Chen',
    category: 'Athlete',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    description: 'Professional basketball player and Olympic medalist inspiring the next generation.',
    hourlyRate: 4000,
    availability: 'available',
    specialties: ['Sports Events', 'Motivational Speaking', 'Youth Coaching'],
    socialMedia: {
      instagram: '@davidchen_ball',
      twitter: '@dchen_hoops'
    },
    rating: 4.9,
    totalBookings: 156
  },
  {
    id: '5',
    name: 'Amanda Foster',
    category: 'Influencer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    description: 'Lifestyle influencer with 2M+ followers, specializing in fashion and wellness content.',
    hourlyRate: 1500,
    availability: 'available',
    specialties: ['Content Creation', 'Brand Partnerships', 'Social Media Campaigns'],
    socialMedia: {
      instagram: '@amandafoster',
      tiktok: '@amanda_lifestyle',
      twitter: '@afoster_life'
    },
    rating: 4.6,
    totalBookings: 312
  },
  {
    id: '6',
    name: 'Robert Taylor',
    category: 'Comedian',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    description: 'Stand-up comedian and TV personality known for his witty observations and crowd work.',
    hourlyRate: 2200,
    availability: 'booked',
    specialties: ['Stand-up Comedy', 'Corporate Events', 'TV Appearances'],
    socialMedia: {
      instagram: '@robertcomedy',
      twitter: '@rtaylor_comedy'
    },
    rating: 4.8,
    totalBookings: 98
  }
];

export const categories = [
  'All',
  'Actress',
  'Musician', 
  'Model',
  'Athlete',
  'Influencer',
  'Comedian'
];