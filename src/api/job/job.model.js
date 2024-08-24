import mongoose from 'mongoose';
const { Schema } = mongoose;

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date_applied: { type: Date, required: true},
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const likedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date_applied: { type: Date, required: true},
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const dislikedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date_applied: { type: Date, required: true},
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});


const jobSchema = new mongoose.Schema({

    company: { type: String, required: true },
    job_description: { type: String, required: true },
    comments: { type: [String], default: [] },
    compensation: { type: String, required: true },
    companyId: { type: String, required: true },
    mode: { type: String, required: true },
    job_id: { type: String, required: true, unique: true },
    posted_date: { type: Date, required: true },
    category: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [likedSchema],
    dislikes: { type: Number, default: 0 },
    dislikedBy: [dislikedSchema],
    applicants: [applicantSchema]
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
