import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    resume: { type: String, required: true }
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
    dislikes: { type: Number, default: 0 },
    applicants: [applicantSchema]
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
