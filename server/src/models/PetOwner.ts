import mongoose, { Document, Schema } from 'mongoose';

// Define the PetOwner interface
export interface IPetOwner extends Document {
  userId: mongoose.Types.ObjectId;
  address?: string;
  emergencyContact?: string;
}

// Create the PetOwner schema
const PetOwnerSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  address: {
    type: String,
    trim: true,
  },
  emergencyContact: {
    type: String,
    trim: true,
  },
});

// Create and export the PetOwner model
export default mongoose.model<IPetOwner>('PetOwner', PetOwnerSchema);
