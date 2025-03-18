import express from 'express';
import { z } from 'zod';

// Middleware will be imported later
// import { auth } from '../middleware/auth';

// Models will be imported later
// import User from '../models/User';
// import PetOwner from '../models/PetOwner';
// import DogWalker from '../models/DogWalker';

const router = express.Router();

// Get current user profile
router.get('/me', /* auth, */ async (req, res) => {
  try {
    // This is a placeholder until we implement the User model and auth middleware
    // const user = await User.findById(req.user.id).select('-password');
    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }
    
    // For now, return a placeholder response
    res.json({
      id: 'placeholder_id',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'pet_owner',
      phone: '123-456-7890',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  // Additional fields based on role
  address: z.string().optional(), // For pet owners
  emergencyContact: z.string().optional(), // For pet owners
  bio: z.string().optional(), // For dog walkers
  hourlyRate: z.number().positive().optional(), // For dog walkers
  experience: z.string().optional(), // For dog walkers
  servicesOffered: z.string().array().optional(), // For dog walkers
});

router.put('/me', /* auth, */ async (req, res) => {
  try {
    // Validate request body
    const validatedData = updateProfileSchema.parse(req.body);
    
    // This is a placeholder until we implement the User model and auth middleware
    // const user = await User.findById(req.user.id);
    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }
    
    // Update user fields
    // Object.assign(user, validatedData);
    // await user.save();
    
    // Update role-specific profile
    // if (user.role === 'pet_owner') {
    //   let petOwner = await PetOwner.findOne({ userId: user.id });
    //   if (!petOwner) {
    //     petOwner = new PetOwner({ userId: user.id });
    //   }
    //   if (validatedData.address) petOwner.address = validatedData.address;
    //   if (validatedData.emergencyContact) petOwner.emergencyContact = validatedData.emergencyContact;
    //   await petOwner.save();
    // } else if (user.role === 'dog_walker') {
    //   let dogWalker = await DogWalker.findOne({ userId: user.id });
    //   if (!dogWalker) {
    //     dogWalker = new DogWalker({ userId: user.id });
    //   }
    //   if (validatedData.bio) dogWalker.bio = validatedData.bio;
    //   if (validatedData.hourlyRate) dogWalker.hourlyRate = validatedData.hourlyRate;
    //   if (validatedData.experience) dogWalker.experience = validatedData.experience;
    //   if (validatedData.servicesOffered) dogWalker.servicesOffered = validatedData.servicesOffered;
    //   await dogWalker.save();
    // }
    
    // For now, return a placeholder response
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: 'placeholder_id',
        ...validatedData,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all dog walkers (for pet owners to browse)
router.get('/dog-walkers', async (req, res) => {
  try {
    // This is a placeholder until we implement the User and DogWalker models
    // const dogWalkers = await User.find({ role: 'dog_walker' })
    //   .select('-password')
    //   .lean();
    
    // const dogWalkerProfiles = await Promise.all(
    //   dogWalkers.map(async (walker) => {
    //     const profile = await DogWalker.findOne({ userId: walker._id }).lean();
    //     return {
    //       ...walker,
    //       ...profile,
    //     };
    //   })
    // );
    
    // For now, return placeholder data
    res.json([
      {
        id: 'walker1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '123-456-7890',
        bio: 'Experienced dog walker with 5 years of experience',
        hourlyRate: 25,
        experience: '5 years',
        servicesOffered: ['Walking', 'Sitting', 'Training'],
        rating: 4.8,
      },
      {
        id: 'walker2',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@example.com',
        phone: '123-456-7891',
        bio: 'Dog lover with 3 years of professional experience',
        hourlyRate: 20,
        experience: '3 years',
        servicesOffered: ['Walking', 'Sitting'],
        rating: 4.5,
      },
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific dog walker profile
router.get('/dog-walkers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // This is a placeholder until we implement the User and DogWalker models
    // const walker = await User.findOne({ _id: id, role: 'dog_walker' })
    //   .select('-password')
    //   .lean();
    
    // if (!walker) {
    //   return res.status(404).json({ message: 'Dog walker not found' });
    // }
    
    // const profile = await DogWalker.findOne({ userId: id }).lean();
    
    // For now, return placeholder data
    if (id === 'walker1') {
      res.json({
        id: 'walker1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '123-456-7890',
        bio: 'Experienced dog walker with 5 years of experience',
        hourlyRate: 25,
        experience: '5 years',
        servicesOffered: ['Walking', 'Sitting', 'Training'],
        rating: 4.8,
        reviews: [
          {
            id: 'review1',
            rating: 5,
            comment: 'Jane was amazing with my dog!',
            date: '2023-06-15',
            reviewer: {
              id: 'owner1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        ],
      });
    } else {
      return res.status(404).json({ message: 'Dog walker not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
