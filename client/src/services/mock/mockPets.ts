// Mock pet data for demo mode
export interface MockPet {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  description?: string;
  imageUrl?: string;
  specialNeeds?: string;
  walkingFrequency?: string;
  walkingDuration?: number;
}

// Mock pets for demo user
export const mockPets: MockPet[] = [
  {
    id: 'pet-1',
    ownerId: 'demo-user',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    size: 'large',
    description: 'Friendly and energetic golden retriever who loves to play fetch.',
    specialNeeds: 'None',
    walkingFrequency: 'Twice daily',
    walkingDuration: 30
  },
  {
    id: 'pet-2',
    ownerId: 'demo-user',
    name: 'Max',
    type: 'Dog',
    breed: 'Beagle',
    age: 5,
    size: 'medium',
    description: 'Curious beagle who loves to explore and sniff everything.',
    specialNeeds: 'Needs to be kept on leash at all times due to strong hunting instinct',
    walkingFrequency: 'Once daily',
    walkingDuration: 45
  },
  {
    id: 'pet-3',
    ownerId: 'po-1',
    name: 'Luna',
    type: 'Dog',
    breed: 'Siberian Husky',
    age: 2,
    size: 'large',
    description: 'Energetic husky who needs lots of exercise.',
    walkingFrequency: 'Twice daily',
    walkingDuration: 60
  },
  {
    id: 'pet-4',
    ownerId: 'po-1',
    name: 'Charlie',
    type: 'Dog',
    breed: 'Poodle',
    age: 4,
    size: 'small',
    description: 'Well-behaved poodle who enjoys short walks.',
    walkingFrequency: 'Once daily',
    walkingDuration: 20
  },
  {
    id: 'pet-5',
    ownerId: 'po-2',
    name: 'Bailey',
    type: 'Dog',
    breed: 'Labrador Retriever',
    age: 1,
    size: 'large',
    description: 'Playful lab puppy with lots of energy.',
    specialNeeds: 'Still in training, needs patient walker',
    walkingFrequency: 'Three times daily',
    walkingDuration: 20
  }
];

// Helper functions
export const getPetsByOwnerId = (ownerId: string): MockPet[] => {
  return mockPets.filter(pet => pet.ownerId === ownerId);
};

export const getPetById = (id: string): MockPet | undefined => {
  return mockPets.find(pet => pet.id === id);
};

export const getAllPets = (): MockPet[] => {
  return mockPets;
};
