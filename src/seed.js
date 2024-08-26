import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Import your models
import User from './api/user/user.model.js';
import Job from './api/job/job.model.js'; 
import SavedHistory from './api/saved_history/saved_history.model.js';

const seed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/techconnect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await SavedHistory.deleteMany({});

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Tech#1995', salt);

    const recruiter = new User({
      firstname: 'Patrick',
      lastname: 'Hill',
      role: 'recruiter',
      phone: '914-555-1234',
      email: 'patrickhill@gmail.com',
      password: hashedPassword,
      profilePic: 'dog.jpeg',
      jobRole: 'Hiring Manager',
      experience: '10 years in recruitment',
      githubLink: '',
      resume: '',
    });

    const candidate = new User({
      firstname: 'Jane',
      lastname: 'Doe',
      role: 'candidate',
      phone: '401-555-5678',
      email: 'jeyjoseph@gmail.com',
      password: hashedPassword,
      profilePic: 'dog.jpeg',
      jobRole: 'Software Engineer',
      experience: '5 years in software development',
      githubLink: 'https://github.com/janedoe',
      resume: 'Resume_Official.pdf',
    });

    await recruiter.save();
    await candidate.save();

    // Create jobs
    const job1 = new Job({
      company: 'Tech Corp',
      job_description: 'Full Stack Developer',
      compensation: '100k',
      mode: 'Remote',
      posted_date: new Date(),
      category: 'Engineering',
      likes: 10,
      dislikes: 2,
      applicants: [
        {
          name: 'Jane Doe',
          date_applied: new Date(),
          user_id: candidate._id,
          job_id: null, // This will be populated after the job is saved
        },
      ],
    });

    const job2 = new Job({
      company: 'Web Solutions',
      job_description: 'Frontend Developer',
      compensation: '80k',
      mode: 'On-site',
      posted_date: new Date(),
      category: 'Design',
      likes: 5,
      dislikes: 0,
      applicants: [],
    });

    await job1.save();
    await job2.save();

    // Update the job_id in the applicants array after saving the job
    job1.applicants[0].job_id = job1._id;
    await job1.save();

    // Create saved history
    const savedHistory = new SavedHistory({
      applicants: [
        {
          name: 'Jane Doe',
          date_applied: new Date(),
          user_id: candidate._id,
          job_id: job1._id,
        },
      ],
    });

    await savedHistory.save();

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();