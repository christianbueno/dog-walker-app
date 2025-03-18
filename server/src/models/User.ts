import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'pet_owner' | 'dog_walker';
  phone?: string;
  createdAt: Date;
}

// Create the User schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['pet_owner', 'dog_walker'],
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Create and export the User model
export default mongoose.model<IUser>('User', UserSchema);
