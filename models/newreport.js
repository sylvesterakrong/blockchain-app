// models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Report || mongoose.model('Report', reportSchema);
