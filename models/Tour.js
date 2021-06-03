const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    from: {
      type: String,
      required: [true, 'Please provide the starting date'],
    },
    to: {
      type: String,
      required: [true, 'Please provide the ending date'],
    },
    daysleft: {
      type: Number,
    },
    duration: {
      type: String,
    },
    cost: {
      type: Number,
      required: [true, 'Please add cost'],
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must can not be more than 10'],
      default: 3.5,
    },
    seats: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    agency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Agency',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Static method to get duration and save
TourSchema.pre('save', async function (next) {
  console.log('Data is being generated');
  const from_date = new Date(this.from);
  const to_date = new Date(this.to);
  const diffTime = Math.abs(to_date - from_date);
  this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

  const curr_date = new Date();
  const diffT = Math.abs(from_date - curr_date);
  const diffD = Math.ceil(diffT / (1000 * 60 * 60 * 24)) - 1;
  this.daysleft = diffD;

  next();
});

// Cascade delete tours when an agency is deleted
TourSchema.pre('remove', async function (next) {
  console.log(`Reviews being removed from tour ${this._id}`);
  await this.model('Review').deleteMany({ review: this._id });
  next();
});

// Reverse populate with virtuals
TourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
  justOne: false,
});

module.exports = mongoose.model('Tour', TourSchema);
