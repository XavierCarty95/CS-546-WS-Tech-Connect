import mongoose from 'mongoose';
const { Schema } = mongoose;

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date_applied: { type: Date, required: true},
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const savedHistorySchema = new mongoose.Schema({
  //Applicant_Name: { type: String, required: true, },
  job_id: { type: String, required: true, },
  //Applied_datetime: { type: String, required: true, },
  applicants: [applicantSchema]
});

const SavedHistory = mongoose.model('SavedHistory', savedHistorySchema);

export default SavedHistory;
