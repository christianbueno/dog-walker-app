import mongoose, { Document, Schema } from 'mongoose';

// Define the DogWalker interface
export interface IDogWalker extends Document {
  userId: mongoose.Types.ObjectId;
  bio?: string;
  hourlyRate?: number;
  experience?: string;
  servicesOffered?: string[];
}

// Create the DogWalker schema
const DogWalkerSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  hourlyRate: {
    type: Number,
    min: 0,
  },
  experience: {
    type: String,
    trim: true,
  },
  servicesOffered: {
    type: [String],
    default: ['Walking'],
  },
});

// Create and export the DogWalker model
export default mongoose.model<IDogWalker>('DogWalker', DogWalkerSchema);
