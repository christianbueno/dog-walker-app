// Mock user data for demo mode
export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'pet_owner' | 'dog_walker';
  phone?: string;
  bio?: string;
  location?: string;
  hourlyRate?: number;
  availability?: string[];
  rating?: number;
  reviews?: number;
}

// Pet owners
export const mockPetOwners: MockUser[] = [
  {
    id: 'po-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'pet_owner',
    phone: '555-123-4567',
    location: 'Chicago, IL'
  },
  {
    id: 'po-2',
    email: 'sarah.smith@example.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'pet_owner',
    phone: '555-987-6543',
    location: 'Chicago, IL'
  }
];

// Dog walkers
export const mockDogWalkers: MockUser[] = [
  {
    id: 'dw-1',
    email: 'mike.walker@example.com',
    firstName: 'Mike',
    lastName: 'Walker',
    role: 'dog_walker',
    phone: '555-456-7890',
    bio: 'Professional dog walker with 5 years of experience. I love all breeds and sizes!',
    location: 'Chicago, IL',
    hourlyRate: 25,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    rating: 4.8,
    reviews: 42
  },
  {
    id: 'dw-2',
    email: 'emma.jones@example.com',
    firstName: 'Emma',
    lastName: 'Jones',
    role: 'dog_walker',
    phone: '555-789-0123',
    bio: 'Certified dog trainer and walker. Specializing in high-energy breeds.',
    location: 'Chicago, IL',
    hourlyRate: 30,
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    rating: 4.9,
    reviews: 37
  },
  {
    id: 'dw-3',
    email: 'david.brown@example.com',
    firstName: 'David',
    lastName: 'Brown',
    role: 'dog_walker',
    phone: '555-234-5678',
    bio: 'Dog lover with a spacious yard. Can handle multiple dogs at once.',
    location: 'Chicago, IL',
    hourlyRate: 22,
    availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    rating: 4.6,
    reviews: 28
  }
];

// Demo user for login
export const demoUser: MockUser = {
  id: 'demo-user',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'pet_owner',
  phone: '555-DEMO-123',
  location: 'Chicago, IL'
};

// All users combined
export const mockUsers: MockUser[] = [
  demoUser,
  ...mockPetOwners,
  ...mockDogWalkers
];

// Helper functions
export const findUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const getAllDogWalkers = (): MockUser[] => {
  return mockDogWalkers;
};
