import { model, Schema } from 'mongoose';
import { TSplier } from './spiler.interface';

const spilerSchema = new Schema<TSplier>({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, 'Name must be at least 3 characters.'],
  },
  phone: {
    type: String,
    requierd: true,
    minLength: [11, 'Number must be 11 characters'],
    maxLength: [11, 'Number max 11 characters'],
  },
  address: { type: String, required: true },
  companyName: { type: String, required: [true, 'Company Name is Requied'] },
  date: { type: Date, default: Date.now },

  isDeleted: { type: Boolean, default: false },
});

export const Splier = model<TSplier>('Splier', spilerSchema);
