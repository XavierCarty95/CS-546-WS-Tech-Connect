import Job from './job.model.js';
import mongoose from 'mongoose';

// Helper function to determine if the user is a recruiter
const isUserRecruiter = (session) => session.user && session.user.role === 'recruiter';

export const createJob = async (req, res) => {
    try {

        const {
            company,
            job_description, // Keeping the original name here
            compensation,
            mode,
            category,
            comments // If comments are being passed in `req.body`
          } = req.body;
          
          // Create an updated job object, adding the posted_date
          let job = {
            company,
            job_description,
            compensation,
            mode,
            category,
            comments,
            posted_date: new Date() // Add the current date as the posted_date
          };
       
        const newJob = new Job(job);
        await newJob.save();

           
        const jobs = await Job.find({}).lean()
        const isRecruiter = isUserRecruiter(req.session);


        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error: error.message });
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

        let filterJobs = [];
        if (req.query.query && req.query.query.trim() !== "") {
            filterJobs = jobs.filter(job =>
                job.company.toLowerCase().includes(req.query.query.trim().toLowerCase())
            );
        } else {
            filterJobs = jobs;
        }

        jobs.forEach(job => {
            job.userHasApplied = job.applicants.some(applicant => 
                applicant.user_id.toString() === userId.toString()
            );
        });
        jobs.forEach(job => {
            job.userHasLiked = job.likedBy.some(like => 
                like.user_id.toString() === userId.toString()
            );
        });
        jobs.forEach(job => {
            job.userHasDisliked = job.dislikedBy.some(dislike => 
                dislike.user_id.toString() === userId.toString()
            );
        });

        const isRecruiter = req.session.user.role === 'recruiter';

        console.log(isRecruiter)

        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: filterJobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
            emptyFilter: filterJobs.length === 0
        });
    } catch (error) {
        res.status(500).render("error", {message: error.message, status: 500})
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
        res.status(500).render("error", {message: error.message, status: 500})
    }
};

export const getUpdatedJob = async (req, res) => {
    try {

    
        const updatedJob = await Job.findById(req.params.id).lean()
        console.log(updatedJob)
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).render("jobs/jobEdit", { job: updatedJob, showLogout: true})
    } catch (error) {
        res.status(500).render("error", {message: error.message, status: 500})
    }
};

export const updateJob = async (req, res) => {
    try {
        console.log("No")
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const jobs = await Job.find({}).lean()
        const isRecruiter = isUserRecruiter(req.session);


        res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
        })
    } catch (error) {
        res.status(500).render("error", {message: error.message, status: 500})
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

        const isRecruiter = isUserRecruiter(req.session);


        /*res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
        })*/
        res.redirect('/job')

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
       
        const jobs = await Job.find({}).lean()
        const isRecruiter = isUserRecruiter(req.session);


        /*res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
        })*/
        res.redirect('/job')

    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
};

export const likeJob = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const newLike = { 
            name: req.session.user.firstname,
            user_id: new mongoose.Types.ObjectId(userId)
        };

        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const jobs = await Job.find({}).lean();

        let check = job._id
        let hasLiked = false, hasDisliked = false;
        
        jobs.forEach(job => {
            job.userHasLiked = job.likedBy.some(like => 
                like.user_id.toString() === userId.toString()
            );
            if(check.equals(job._id) && job.userHasLiked){
                hasLiked = true;
            }
        });

        jobs.forEach(job => {
            job.userHasDisliked = job.dislikedBy.some(dislike => 
                dislike.user_id.toString() === userId.toString()
            );
            if(check.equals(job._id) && job.userHasDisliked){
                hasDisliked = true;
            }
        });

        if(hasLiked){
            job.likes -= 1
            job.likedBy.pull(newLike)
            await job.save()
        }
        else if(hasDisliked){
            job.likes += 1
            job.likedBy.push(newLike)
            job.dislikes -= 1
            job.dislikedBy.pull(newLike);
            await job.save();        
        } else {
            job.likes += 1
            job.likedBy.push(newLike);
            await job.save();
        }

        jobs.forEach(job => {
            job.userHasLiked = job.likedBy.some(like => 
                like.user_id.toString() === userId.toString()
            );
        });

        const isRecruiter = isUserRecruiter(req.session);


        /*res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
        })*/
        res.redirect('/job')

    } catch (error) {
        res.status(500).json({ message: 'Error disliking job', error: error.message });
    }
};

export const dislikeJob = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const newDislike = { 
            name: req.session.user.firstname,
            user_id: new mongoose.Types.ObjectId(userId)
        };

        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const jobs = await Job.find({}).lean();

        let check = job._id
        let hasLiked = false, hasDisliked = false;

        jobs.forEach(job => {
            job.userHasLiked = job.likedBy.some(like => 
                like.user_id.toString() === userId.toString()
            );
            if(check.equals(job._id) && job.userHasLiked){
                hasLiked = true;
            }
        });

        jobs.forEach(job => {
            job.userHasDisliked = job.dislikedBy.some(dislike => 
                dislike.user_id.toString() === userId.toString()
            );
            if(check.equals(job._id) && job.userHasDisliked){
                hasDisliked = true;
            }
        });

        if(hasLiked){
            job.likes -= 1
            job.likedBy.pull(newDislike)
            job.dislikes += 1
            job.dislikedBy.push(newDislike);
            await job.save();
        }
        else if(hasDisliked){
            job.dislikes -= 1
            job.dislikedBy.pull(newDislike);
            await job.save();
        }
        else {
            job.dislikes += 1
            job.dislikedBy.push(newDislike);
            await job.save();
        }

        jobs.forEach(job => {
            job.userHasDisliked = job.dislikedBy.some(dislike => 
                dislike.user_id.toString() === userId.toString()
            );
        });

        /*res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showLogout: true
        });*/
        res.redirect('/job')

    } catch (error) {
        res.status(500).json({ message: 'Error disliking job', error: error.message });
    }
};

export const getApplicants  = async (req, res) => {
    const job = await Job.findById(req.params.id).lean()

    const applicants = job.applicants

    res.status(200).render('jobs/applicants', { 
        applicants,
        showLogout: req.session.user.id
    });
};

export const addComments =  async (req, res) => {
    try {
        const jobId = req.params.id;
        const { author, text } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.comments.push({ author, text });
        await job.save();

        const isRecruiter = isUserRecruiter(req.session);
        const jobs = await Job.find({}).lean();

        /*res.status(200).render('jobs/jobFeed', { 
            title: 'Job Feed',
            jobMock: jobs,
            showPostButton: isRecruiter,
            showLogout: true,
            isRecruiter: isRecruiter,
        })*/
        res.redirect('/job')
    } catch (error) {
        res.status(500).json({ message: 'Error posting comment', error });
    }
};