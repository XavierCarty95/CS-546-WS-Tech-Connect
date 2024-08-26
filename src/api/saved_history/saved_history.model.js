import mongoose from 'mongoose';
const { Schema } = mongoose;

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date_applied: { type: Date, required: true},
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true }
});


const savedHistorySchema = new mongoose.Schema({
  applicants: [applicantSchema]
});

const SavedHistory = mongoose.model('SavedHistory', savedHistorySchema);

export default SavedHistory;
