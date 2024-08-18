import Job from './job.model.js';
import { jobMock } from '../../helpers/jobFeedData.js'


export const createJob = async (req, res) => {
    try {
        const jobData = req.body;
        const newJob = new Job(jobData);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};


export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        console.log(jobMock)
        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobMock
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};


export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById( req.params.id );
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
       console.log(req.body);
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        console.log("haha",updatedJob);
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete( req.params.id );
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
};
