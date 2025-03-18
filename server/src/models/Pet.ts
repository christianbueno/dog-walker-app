import mongoose, { Document, Schema } from 'mongoose';

// Define the Pet interface
export interface IPet extends Document {
  name: string;
  breed: string;
  size: 'small' | 'medium' | 'large';
  ownerId: mongoose.Types.ObjectId;
  temperament?: string;
  specialNeeds?: string;
  medicalInfo?: string;
}

// Create the Pet schema
const PetSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  temperament: {
    type: String,
    trim: true,
  },
  specialNeeds: {
    type: String,
    trim: true,
  },
  medicalInfo: {
    type: String,
    trim: true,
  },
});

// Create and export the Pet model
export default mongoose.model<IPet>('Pet', PetSchema);
