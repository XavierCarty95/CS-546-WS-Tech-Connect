import mongoose from 'mongoose';

const savedHistorySchema = new mongoose.Schema({
  Applicant_Name: {
    type: String,
    required: true,
  },
  Job_id: {
    type: String,
    required: true,
  },
  Applied_datetime: {
    type: String,
    required: true,
  },
});

const SavedHistory = mongoose.model('SavedHistory', savedHistorySchema);
export default SavedHistory;
