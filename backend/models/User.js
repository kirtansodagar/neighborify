import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  phone: { type: String, required: true, unique: true, match: /^\+91[6-9]\d{9}$/ },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, minlength: 8, select: false },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  neighborhood: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  isPhoneVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  refreshToken: { type: String, select: false },
  fcmToken: { type: String, default: '' },
}, { timestamps: true });

userSchema.index({ pincode: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
