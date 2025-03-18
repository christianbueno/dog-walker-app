// Mock service to intercept API calls in demo mode
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { demoUser, findUserByEmail, getAllDogWalkers, findUserById } from './mockUsers';
import { getPetsByOwnerId, getPetById, getAllPets } from './mockPets';
import { 
  getBookingsByOwnerId, 
  getBookingById, 
  getBookingWithDetails,
  getUpcomingBookingsByOwnerId,
  getPastBookingsByOwnerId
} from './mockBookings';

// Check if we're in demo mode
export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

// Mock API response generator
const createMockResponse = <T>(data: T): AxiosResponse<T> => {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {} as AxiosHeaders,
    config: {} as InternalAxiosRequestConfig,
  };
};

// Mock error response
const createErrorResponse = (status: number, message: string): AxiosResponse => {
  return {
    data: { message },
    status,
    statusText: status === 404 ? 'Not Found' : 'Error',
    headers: {} as AxiosHeaders,
    config: {} as InternalAxiosRequestConfig,
  };
};

// Handle authentication requests
export const handleAuthRequest = async (url: string, method: string, data?: any): Promise<AxiosResponse> => {
  // Login endpoint
  if (url.includes('/auth/login') && method === 'post') {
    const { email, password } = data;
    
    // In demo mode, accept any credentials for demo@example.com
    if (email === 'demo@example.com') {
      return createMockResponse({
        token: 'demo-jwt-token',
        user: demoUser
      });
    }
    
    // Check if user exists
    const user = findUserByEmail(email);
    if (user) {
      // In demo mode, accept any password
      return createMockResponse({
        token: 'mock-jwt-token',
        user
      });
    }
    
    // User not found
    return createErrorResponse(401, 'Invalid credentials');
  }
  
  // Register endpoint
  if (url.includes('/auth/register') && method === 'post') {
    // In demo mode, just return success with the demo user
    return createMockResponse({
      token: 'demo-jwt-token',
      user: {
        ...demoUser,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      }
    });
  }
  
  // Unhandled auth endpoint
  return createErrorResponse(404, 'Endpoint not found');
};

// Handle user requests
export const handleUserRequest = async (url: string, method: string): Promise<AxiosResponse> => {
  // Get current user
  if (url.includes('/users/me') && method === 'get') {
    return createMockResponse(demoUser);
  }
  
  // Get all dog walkers
  if (url.includes('/users/dog-walkers') && method === 'get') {
    // Check if it's a specific dog walker request
    const match = url.match(/\/users\/dog-walkers\/([^\/]+)$/);
    if (match) {
      const walkerId = match[1];
      const walker = findUserById(walkerId);
      
      if (walker && walker.role === 'dog_walker') {
        return createMockResponse(walker);
      }
      
      return createErrorResponse(404, 'Dog walker not found');
    }
    
    // Return all dog walkers
    return createMockResponse(getAllDogWalkers());
  }
  
  // Update user profile
  if (url.includes('/users/me') && method === 'put') {
    // In demo mode, just return success with the demo user
    // In a real app, we would update the user data
    return createMockResponse(demoUser);
  }
  
  // Unhandled user endpoint
  return createErrorResponse(404, 'Endpoint not found');
};

// Handle pet requests
export const handlePetRequest = async (url: string, method: string, data?: any): Promise<AxiosResponse> => {
  // Get all pets for current user
  if (url.includes('/pets') && method === 'get' && !url.includes('/pets/')) {
    return createMockResponse(getPetsByOwnerId('demo-user'));
  }
  
  // Get specific pet
  if (url.includes('/pets/') && method === 'get') {
    const match = url.match(/\/pets\/([^\/]+)$/);
    if (match) {
      const petId = match[1];
      const pet = getPetById(petId);
      
      if (pet) {
        return createMockResponse(pet);
      }
      
      return createErrorResponse(404, 'Pet not found');
    }
  }
  
  // Create new pet
  if (url.includes('/pets') && method === 'post') {
    // In demo mode, just return success with the new pet data
    // In a real app, we would save the pet data
    const newPet = {
      id: `pet-new-${Date.now()}`,
      ownerId: 'demo-user',
      ...data
    };
    
    return createMockResponse(newPet);
  }
  
  // Update pet
  if (url.includes('/pets/') && method === 'put') {
    const match = url.match(/\/pets\/([^\/]+)$/);
    if (match) {
      const petId = match[1];
      const pet = getPetById(petId);
      
      if (pet) {
        // In demo mode, just return success with the updated pet data
        return createMockResponse({
          ...pet,
          ...data
        });
      }
      
      return createErrorResponse(404, 'Pet not found');
    }
  }
  
  // Delete pet
  if (url.includes('/pets/') && method === 'delete') {
    const match = url.match(/\/pets\/([^\/]+)$/);
    if (match) {
      const petId = match[1];
      const pet = getPetById(petId);
      
      if (pet) {
        // In demo mode, just return success
        return createMockResponse({ success: true });
      }
      
      return createErrorResponse(404, 'Pet not found');
    }
  }
  
  // Unhandled pet endpoint
  return createErrorResponse(404, 'Endpoint not found');
};

// Handle booking requests
export const handleBookingRequest = async (url: string, method: string, data?: any): Promise<AxiosResponse> => {
  // Get all bookings for current user
  if (url.includes('/bookings') && method === 'get' && !url.includes('/bookings/')) {
    return createMockResponse(getBookingsByOwnerId('demo-user'));
  }
  
  // Get specific booking
  if (url.includes('/bookings/') && method === 'get') {
    const match = url.match(/\/bookings\/([^\/]+)$/);
    if (match) {
      const bookingId = match[1];
      const bookingWithDetails = getBookingWithDetails(bookingId);
      
      if (bookingWithDetails) {
        return createMockResponse(bookingWithDetails);
      }
      
      return createErrorResponse(404, 'Booking not found');
    }
  }
  
  // Create new booking
  if (url.includes('/bookings') && method === 'post') {
    // In demo mode, just return success with the new booking data
    const newBooking = {
      id: `booking-new-${Date.now()}`,
      ownerId: 'demo-user',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    
    return createMockResponse(newBooking);
  }
  
  // Update booking status
  if (url.includes('/bookings/') && url.includes('/status') && method === 'patch') {
    const match = url.match(/\/bookings\/([^\/]+)\/status$/);
    if (match) {
      const bookingId = match[1];
      const booking = getBookingById(bookingId);
      
      if (booking) {
        // In demo mode, just return success with the updated booking data
        return createMockResponse({
          ...booking,
          status: data.status,
          updatedAt: new Date().toISOString()
        });
      }
      
      return createErrorResponse(404, 'Booking not found');
    }
  }
  
  // Cancel booking
  if (url.includes('/bookings/') && method === 'delete') {
    const match = url.match(/\/bookings\/([^\/]+)$/);
    if (match) {
      const bookingId = match[1];
      const booking = getBookingById(bookingId);
      
      if (booking) {
        // In demo mode, just return success
        return createMockResponse({ success: true });
      }
      
      return createErrorResponse(404, 'Booking not found');
    }
  }
  
  // Unhandled booking endpoint
  return createErrorResponse(404, 'Endpoint not found');
};

// Main mock service handler
export const handleMockRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const { url, method, data } = config;
  
  if (!url) {
    return createErrorResponse(400, 'URL is required');
  }
  
  // Handle different API endpoints
  if (url.includes('/auth')) {
    return handleAuthRequest(url, method?.toLowerCase() || 'get', data);
  }
  
  if (url.includes('/users')) {
    return handleUserRequest(url, method?.toLowerCase() || 'get');
  }
  
  if (url.includes('/pets')) {
    return handlePetRequest(url, method?.toLowerCase() || 'get', data);
  }
  
  if (url.includes('/bookings')) {
    return handleBookingRequest(url, method?.toLowerCase() || 'get', data);
  }
  
  // Unhandled endpoint
  return createErrorResponse(404, 'Endpoint not found');
};

// Setup axios interceptor for demo mode
export const setupMockInterceptor = () => {
  // Add a request interceptor
  const interceptor = axios.interceptors.request.use(
    async (config) => {
      // Only intercept in demo mode and for API calls
      if (isDemoMode() && config.url?.includes('/api')) {
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Handle the request and return a mock response
          const response = await handleMockRequest(config);
          
          // Return a custom object that axios will recognize as a completed request
          return {
            ...config,
            adapter: () => Promise.resolve(response)
          };
        } catch (error) {
          return Promise.reject(error);
        }
      }
      
      // Proceed with the request normally if not in demo mode
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Return a function to eject the interceptor if needed
  return () => axios.interceptors.request.eject(interceptor);
};
