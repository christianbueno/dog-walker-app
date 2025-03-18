// Mock booking data for demo mode
import { mockPets } from './mockPets';
import { mockDogWalkers } from './mockUsers';

export interface MockBooking {
  id: string;
  petId: string;
  walkerId: string;
  ownerId: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price?: number;
  rating?: number;
  review?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Helper function to create dates relative to today
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Create some mock bookings
export const mockBookings: MockBooking[] = [
  // Demo user's bookings - upcoming
  {
    id: 'booking-1',
    petId: 'pet-1', // Buddy (Golden Retriever)
    walkerId: 'dw-1', // Mike Walker
    ownerId: 'demo-user',
    date: getRelativeDate(1), // Tomorrow
    startTime: '10:00',
    duration: 30,
    status: 'confirmed',
    notes: 'Please bring water for Buddy.',
    price: 25,
    createdAt: getRelativeDate(-2) + 'T12:00:00Z',
    updatedAt: getRelativeDate(-2) + 'T12:30:00Z'
  },
  {
    id: 'booking-2',
    petId: 'pet-2', // Max (Beagle)
    walkerId: 'dw-2', // Emma Jones
    ownerId: 'demo-user',
    date: getRelativeDate(3), // 3 days from now
    startTime: '15:30',
    duration: 45,
    status: 'pending',
    notes: 'Max needs to be kept on leash at all times.',
    price: 35,
    createdAt: getRelativeDate(-1) + 'T09:15:00Z',
    updatedAt: getRelativeDate(-1) + 'T09:15:00Z'
  },
  
  // Demo user's bookings - past
  {
    id: 'booking-3',
    petId: 'pet-1', // Buddy
    walkerId: 'dw-1', // Mike Walker
    ownerId: 'demo-user',
    date: getRelativeDate(-5), // 5 days ago
    startTime: '14:00',
    duration: 30,
    status: 'completed',
    notes: '',
    price: 25,
    rating: 5,
    review: 'Mike was great with Buddy! Will book again.',
    createdAt: getRelativeDate(-10) + 'T08:00:00Z',
    updatedAt: getRelativeDate(-5) + 'T14:45:00Z'
  },
  {
    id: 'booking-4',
    petId: 'pet-2', // Max
    walkerId: 'dw-3', // David Brown
    ownerId: 'demo-user',
    date: getRelativeDate(-10), // 10 days ago
    startTime: '11:00',
    duration: 45,
    status: 'completed',
    notes: '',
    price: 30,
    rating: 4,
    review: 'David was good with Max, but was 5 minutes late.',
    createdAt: getRelativeDate(-15) + 'T10:30:00Z',
    updatedAt: getRelativeDate(-10) + 'T12:00:00Z'
  },
  
  // Other users' bookings
  {
    id: 'booking-5',
    petId: 'pet-3', // Luna (Husky)
    walkerId: 'dw-2', // Emma Jones
    ownerId: 'po-1',
    date: getRelativeDate(2), // 2 days from now
    startTime: '09:00',
    duration: 60,
    status: 'confirmed',
    notes: 'Luna needs a lot of exercise.',
    price: 45,
    createdAt: getRelativeDate(-3) + 'T16:20:00Z',
    updatedAt: getRelativeDate(-3) + 'T17:00:00Z'
  },
  {
    id: 'booking-6',
    petId: 'pet-5', // Bailey (Lab puppy)
    walkerId: 'dw-1', // Mike Walker
    ownerId: 'po-2',
    date: getRelativeDate(-2), // 2 days ago
    startTime: '16:00',
    duration: 20,
    status: 'completed',
    notes: 'Bailey is still in training.',
    price: 15,
    rating: 5,
    review: 'Mike was patient with our puppy. Highly recommend!',
    createdAt: getRelativeDate(-7) + 'T14:10:00Z',
    updatedAt: getRelativeDate(-2) + 'T16:30:00Z'
  }
];

// Helper functions
export const getBookingsByOwnerId = (ownerId: string): MockBooking[] => {
  return mockBookings.filter(booking => booking.ownerId === ownerId);
};

export const getBookingsByWalkerId = (walkerId: string): MockBooking[] => {
  return mockBookings.filter(booking => booking.walkerId === walkerId);
};

export const getBookingsByPetId = (petId: string): MockBooking[] => {
  return mockBookings.filter(booking => booking.petId === petId);
};

export const getBookingById = (id: string): MockBooking | undefined => {
  return mockBookings.find(booking => booking.id === id);
};

// Get upcoming bookings (today or future)
export const getUpcomingBookingsByOwnerId = (ownerId: string): MockBooking[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockBookings.filter(
    booking => booking.ownerId === ownerId && 
    booking.date >= today && 
    (booking.status === 'confirmed' || booking.status === 'pending')
  );
};

// Get past bookings (before today or completed/cancelled)
export const getPastBookingsByOwnerId = (ownerId: string): MockBooking[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockBookings.filter(
    booking => booking.ownerId === ownerId && 
    (booking.date < today || 
    booking.status === 'completed' || 
    booking.status === 'cancelled')
  );
};

// Get booking with additional details (pet and walker info)
export const getBookingWithDetails = (bookingId: string) => {
  const booking = getBookingById(bookingId);
  if (!booking) return null;
  
  const pet = mockPets.find(p => p.id === booking.petId);
  const walker = mockDogWalkers.find(w => w.id === booking.walkerId);
  
  return {
    ...booking,
    pet,
    walker
  };
};
