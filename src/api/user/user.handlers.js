import User from "./user.model.js";
import { candidates } from '../../helpers/dummyData.js'
import bcrypt from 'bcryptjs'

const saltRounds = 10;


export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: req.body.role,
      phone: req.body.phone,
      email: req.body.email,
      companyID: req.body.companyID,
      password: hashedPassword,
      profilePic: req.files['profilePic'] ? req.files['profilePic'][0].path : null,
      jobRole: req.body.jobRole,
      experience: req.body.experience,
      githubLink: req.body.githubLink,
      resume: req.files['resume'] ? req.files['resume'][0].path : null,
    };

    const newUser = new User(userData);
    await newUser.save();

    if(newUser.role == 'recruiter') { 
        return res.status(200).render('users/feed',
        { header: `Welcome, ${newUser.firstname}`, 
          title: 'User Feed', 
          candidates: candidates,
          showLogout: true
         });
    } else { 
        return res.render('jobs/jobFeed')
    }
  } catch (error) {
    console.log((error.message))
    res.status(500).json({ message: "Error creating user", error });
  }
};
export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Request Body:', req.body);

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    console.log('User Found:', user);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);

    if (isMatch) {
        // Set session
        req.session.user = {
            firstname: user.firstname,
            lastname: user.lastname,
            id: user._id,
            role: user.role
        };
        console.log('Session Set:', req.session.user);

        // Ensure session is saved before redirecting
        req.session.save((err) => {
            if (err) {
                console.error('Session Save Error:', err);
                return res.status(500).json({ message: "Error saving session", error: err });
            }

            // Redirect based on user role
            if (user.role === 'recruiter') {
                console.log('Redirecting to /user');
                return res.redirect('/user');  // Redirect to the recruiter feed
            } else {
                console.log('Redirecting to /job');
                return res.redirect('/job');    // Redirect to the job feed
            }
        });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).render('users/feed',
     { header: "Users", 
       title: 'User Feed', 
       candidates: candidates,
       showLogout: true
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
