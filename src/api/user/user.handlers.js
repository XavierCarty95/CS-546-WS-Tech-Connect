import User from "./user.model.js";
import { candidates } from '../../helpers/dummyData.js'
import bcrypt from 'bcryptjs'

const saltRounds = 10;


export const createUser = async (req, res) => {
  try {
    console.log("Creating user...");
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Prepare user data
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

    // Log the user data for debugging
    console.log("User data:", userData);

    // Create and save the new user
    const newUser = new User(userData);
    await newUser.save();

    req.session.user = {
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      id: newUser._id,
      role: newUser.role
  };

  // Save session 
  req.session.save((err) => {
      if (err) {
          console.error('Session Save Error:', err);
          return res.status(500).json({ message: "Error saving session", error: err });
      }
  });

    const users = User.find({})

  

    // Redirect based on user role
    if (newUser.role === 'recruiter') {
      return res.status(200).render('users/feed', {
        header: `Welcome, ${newUser.firstname}`, 
        title: 'User Feed', 
        candidates: users,
        showLogout: true
      });
    } else {
      return res.render('jobs/jobFeed');
    }
  } catch (error) {
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
    const users = await User.find({}).lean();
    console.log(users)
    
    res.status(200).render('users/feed',
     { header: "Users", 
       title: 'User Feed', 
       candidates: users,
       showLogout: true
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fullname = `${user.firstname} ${user.lastname}`;
    const userProfile = {
        id: user._id,
        name: fullname,
        role: user.role,
        phone: user.phone,
        email: user.email,
        companyID: user.companyID,
        profilePic: user.profilePic,
        jobRole: user.jobRole,
        experience: user.experience,
        githubLink: user.githubLink,
        resume: user.resume
    };

    res.render('profilePage/profile', { 
        title: `${fullname}'s Profile`,
        user: userProfile,
        showLogout: true
    });
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


    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error destroying session", error: err });
      }

      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      return res.status(200).render("login");
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export const getProfile = async (req, res) => {
  try {
      const user = await User.findById(req.session.user.id).lean();
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const fullname = `${user.firstname} ${user.lastname}`;
      const userProfile = {
          id: user._id,
          name: fullname,
          role: user.role,
          phone: user.phone,
          email: user.email,
          companyID: user.companyID,
          profilePic: user.profilePic,
          jobRole: user.jobRole,
          experience: user.experience,
          githubLink: user.githubLink,
          resume: user.resume
      };

      res.render('profilePage/profile', { 
          title: `${fullname}'s Profile`,
          user: userProfile,
          showLogout: true
      });
  } catch (error) {
      res.status(500).json({ message: "Error loading profile", error });
  }
};

export const editProfile = async (req, res) => {
  try {
      console.log("User ID:", req.session.user.id);
      const currUser = await User.findById(req.session.user.id).lean();
      if (!currUser) {
          return res.status(404).json({ message: "User not found" });
      }

      const user = {
          firstname: currUser.firstname,
          lastname: currUser.lastname,
          phone: currUser.phone,
          email: currUser.email,
          companyID: currUser.companyID,
          profilePic: currUser.profilePic,
          jobRole: currUser.jobRole,
          experience: currUser.experience,
          githubLink: currUser.githubLink,
          resume: currUser.resume
      };

      res.render('profilePage/editProfile', { 
          title: 'Edit Profile',
          user,
          showLogout: true
      });
  } catch (error) {
      console.error('Error editing profile:', error);
      res.status(500).json({ message: 'Error editing profile', error });
  }
};

export const updateProfile = async (req, res) => {
  let { name, phone, email, companyID, profilePic, jobRole, experience, githubLink, resume } = req.body;
  let firstname = name[0]
  let lastname = name[1]
  try {
      const update = { firstname, lastname, phone, email, companyID, profilePic, jobRole, experience, githubLink, resume };
      const user = await User.findByIdAndUpdate(req.session.user.id, update, {
          new: true,
      }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.redirect("/user/profile")
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};