const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if the user is not using OAuth
        return !this.googleId && !this.phoneAuth;
      },
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'superadmin'],
      default: 'staff'
    },
    phone: {
      type: String,
      trim: true
    },
    googleId: {
      type: String
    },
    phoneAuth: {
      type: Boolean,
      default: false
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: function() {
        // Hotel reference is required for all users except superadmin
        return this.role !== 'superadmin';
      }
    },
    profileImage: {
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data before sending to client
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 