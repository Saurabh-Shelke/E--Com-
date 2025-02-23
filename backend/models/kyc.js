const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  panNumber: { type: String, required: true },
  panName: { type: String, required: true },
  panCardFilePath: { type: String, required: false }, // Renamed for clarity
  aadharNumber: { type: String, required: true },
  aadharName: { type: String, required: true },
  aadharFilePath: { type: String, required: false }, // Renamed for clarity
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  passbookFilePath: { type: String, required: false }, // Renamed for clarity
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'not_verified'],
    default: 'pending'
},
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes can be added if necessary
kycSchema.index({ userId: 1 });

module.exports = mongoose.model('KYC', kycSchema);
