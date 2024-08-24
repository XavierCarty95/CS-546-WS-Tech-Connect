import Job from './job.model.js';
import mongoose from 'mongoose';

// Helper function to determine if the user is a recruiter
const isUserRecruiter = (session) => session.user && session.user.role === 'recruiter';

export const createJob = async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();

        const jobs = await Job.find({}).lean();
        const isRecruiter = isUserRecruiter(req.session);

        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};

export const renderJobForm = (req, res) => {
    res.render('jobs/JobForm', { 
        title: 'Create Job', 
        showLogout: !!(req.session && req.session.user)
    });
};

export const getJobs = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const jobs = await Job.find({}).lean();

        jobs.forEach(job => {
            job.userHasApplied = job.applicants.some(applicant => 
                applicant.user_id.toString() === userId.toString()
            );
        });

        const isRecruiter = req.session.user.role === 'recruiter';

        console.log(isRecruiter)

        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter // Pass the isRecruiter value to the template
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};

export const updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};

export const applyJob = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const newApplicant = { 
            name: req.session.user.firstname,
            date_applied: new Date(),
            user_id: new mongoose.Types.ObjectId(userId)
        };

        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.applicants.push(newApplicant);
        await job.save();

        const jobs = await Job.find({}).lean();
        jobs.forEach(job => {
            job.userHasApplied = job.applicants.some(applicant => 
                applicant.user_id.toString() === userId.toString()
            );
        });

        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showLogout: true
        });

    } catch (error) {
        res.status(500).json({ message: 'Error applying to job', error: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
};