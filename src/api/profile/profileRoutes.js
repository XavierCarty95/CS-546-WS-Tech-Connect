import express from "express";
const router = express.Router();

router.get("/", (req, res) => { 
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        profilePic: '/public/images/dog.jpg',
        companyID: 'COMP1234',
        jobRole: 'Software Developer',
        experience: '5 years',
        githubLink: 'https://github.com/johndoe',
        role: 'Candidate'
    };

    res.status(200).render('profilePage/profile', { 
        title: 'Profile', 
        user, 
        showLogout: true
    });
   
});

router.get('/edit', (req, res) => {
    // Example user data - replace this with actual user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        jobRole: 'Software Developer',
        profilePic: '/public/images/dog.jpg',
        experience: '5 years',
        githubLink: 'https://github.com/johndoe',
    };

    res.render('profilePage/editProfile', { 
        title: 'Edit Profile', 
        user, 
        showLogout: true
    });
});

export default router;