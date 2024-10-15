const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportNumber: { type: String, required: true },
  title: { type: String, required: true }, // Ensure this is correct
  content: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }, // Correct field for date
  status: { type: String, default: 'Submitted' }, // Add a default status if needed
});

module.exports = mongoose.model('Report', reportSchema);
