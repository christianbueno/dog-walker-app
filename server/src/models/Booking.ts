import mongoose, { Document, Schema } from 'mongoose';

// Define the Booking interface
export interface IBooking extends Document {
  petId: mongoose.Types.ObjectId;
  dogWalkerId: mongoose.Types.ObjectId;
  petOwnerId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'canceled';
  price: number;
  specialInstructions?: string;
  createdAt: Date;
}

// Create the Booking schema
const BookingSchema: Schema = new Schema({
  petId: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  dogWalkerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  petOwnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'canceled'],
    default: 'pending',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Booking model
export default mongoose.model<IBooking>('Booking', BookingSchema);
