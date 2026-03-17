const mongoose = require('mongoose');

const messOffSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    meals: [
      {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true,
      },
    ],

    reason: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add index for faster queries
messOffSchema.index({ studentId: 1, fromDate: 1, toDate: 1 });

module.exports = mongoose.model('MessOff', messOffSchema);