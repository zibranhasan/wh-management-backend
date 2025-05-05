import { model, Schema } from 'mongoose';
import { IUser, UserModel } from '../User/user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: [true, 'Name is Required'] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['admin', 'user'], required: true },
    phone: { type: String, required: true },
    image: { type: String, default: '' },
    totalSale: { type: Number, default: 0 },
    totalSalesDue: { type: Number, default: 0 },
    dueCollectionHistory: [
      {
        buyerName: { type: String, required: true },
        date: { type: Date, required: true },
        collectedAmount: { type: Number, required: true, default: 0 },
      },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
userSchema.pre('save', async function () {
  //
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
});

//post save middleware /

userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatch = async function (
  planTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(planTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
