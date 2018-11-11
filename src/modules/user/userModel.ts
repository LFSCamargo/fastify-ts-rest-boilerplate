import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserType extends mongoose.Document {
  _id: string;
  name: string;
  password: string;
  email: string;
  active: boolean;
  authenticate: (plainPassword: string) => boolean,
}

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      hidden: true,
    },
    email: {
      type: String,
      required: false,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'user',
  },
);

Schema.methods = {
  authenticate(plainPassword) {
    return bcrypt.compareSync(plainPassword, this.password)
  },
  encryptPassword(password) {
    return bcrypt.hashSync(password, 8);
  },
}

Schema.pre('save', (next) => {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }
  return next();
})

export default mongoose.model<UserType>('User', Schema);