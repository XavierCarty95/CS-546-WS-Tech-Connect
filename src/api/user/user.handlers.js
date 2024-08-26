import User from "./user.model.js";
import bcrypt from "bcryptjs";
import path from "path";

import * as validators from "../../helpers/validators.js";

const saltRounds = 10;

export const createUser = async (req, res) => {
  try {

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
     // Extract the filename from the full path
     const profilePic = req.files["profilePic"]
     ? path.basename(req.files["profilePic"][0].path) // Extract only the file name
     : null;

    const resume = req.files["resume"]
     ? path.basename(req.files["resume"][0].path) // Extract only the file name
     : null;


    const userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: req.body.role,
      phone: req.body.phone,
      email: req.body.email,
      companyID: req.body.companyID,
      password: hashedPassword,
      profilePic: profilePic,
      jobRole: req.body.jobRole,
      experience: req.body.experience,
      githubLink: req.body.githubLink,
      resume: resume,
    };
  
    validators.validateFirstName(userData.firstname);
    validators.validateLastName(userData.lastname);
    validators.validateEmail(userData.email);
    validators.validatePassword(userData.password);
    validators.validateJobRole(userData.jobRole);
    validators.validateExperience(userData.experience);
    validators.validateGitHubLink(userData.githubLink)

    console.log("All validations passed.");
    console.log( userData.jobRole)
    // Create and save the new user
    const newUser = new User(userData);
    await newUser.save();

    // Setting up the session for the new user
    req.session.user = {
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      id: newUser._id,
      role: newUser.role,
    };

    // Save session
    req.session.save(async (err) => {
      if (err) {
        console.error("Session Save Error:", err);
        return res
          .status(500)
          .json({ message: "Error saving session", error: err });
      }

      const users = await User.find({}).lean(); // Await the fetching of users

      // Redirect based on user role
      if (newUser.role === "recruiter") {
        return res.status(200).render("users/feed", {
          header: `Welcome, ${newUser.firstname}`,
          title: "User Feed",
          candidates: users, // Assuming you want to show the list of candidates
          showLogout: true,
        });
      } else {
        return res.render("jobs/jobFeed", { showLogout: true });
      }
    });
  } catch (error) {
    res.render("error", { message: "Error creating user", status: 500})
  }
};

export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request Body:", req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).lean();
    console.log("User Found:", user);

    if (!user) {
      return res.render("error", { message: "Invalid Credentials", status: 401})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (isMatch) {
      req.session.user = {
        firstname: user.firstname,
        lastname: user.lastname,
        id: user._id,
        role: user.role,
      };

      req.session.save((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error saving session", error: err });
        }

        if (user.role === "recruiter") {
          return res.redirect("/user");
        } else {
          return res.redirect("/job"); // Redirect to the job feed
        }
      });
    } else {
      return res.render("error", { message: "Invalid Credentials", status: 401})
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("error", { message: "Error logging in", status: 500})  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();

    users.forEach(user => {
      if (user.profilePic === " ") {
          user.profilePic = "defaultdog";
      }
    });

    res.status(200).render("users/feed", {
      header: "Users",
      title: "User Feed",
      candidates: users,
      showLogout: true,
    });
  } catch (error) {
    res.render("error", { message: "Internal Server Error", status: 500})  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.render("error", { message: "User not found", status: 404})
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
      resume: user.resume,
    };

    console.log(req.session.user.id == user._id.toString())
    res.render("profilePage/profile", {
      title: `${fullname}'s Profile`,
      user: userProfile,
      showLogout: true,
      shouldShowDelete: req.session.user.id == user._id.toString()
    });
  } catch (error) {
    res.render("error", { message: "User not found", status: 404})
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    user.save()
    if (!user) {
      return res.render("error", { message: "User not found", status: 404})
    }
    res.status(200).json(user);
  } catch (error) {
    res.render("error", { message: "Error updating user", status: 500})
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.render("error", { message: "User not found", status: 404})
    }

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error destroying session", error: err });
      }

      res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      return res.status(200).render("login");
    });
  } catch (error) {
    res.render("error", { message: "Trouble deleting user", status: 500})
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).lean();
    if (!user) {
      return res.render("error", { message: "User not found", status: 404})
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
      resume: user.resume,
    };

    console.log(req.session.user.id == userProfile.id.toString())
    res.render("profilePage/profile", {
      title: `${fullname}'s Profile`,
      user: userProfile,
      showLogout: true,
      shouldShowDelete: req.session.user.id == userProfile.id.toString()
    });
  } catch (error) {
    res.render("error", { message: "Error loading profile", status: 500})  }
};

export const editProfile = async (req, res) => {
  try {
    const currUser = await User.findById(req.session.user.id).lean();
    if (!currUser) {
      return res.render("error", { message: "User not found", status: 404})
    }

    const user = {
      id: req.session.user.id,
      firstname: currUser.firstname,
      lastname: currUser.lastname,
      phone: currUser.phone,
      email: currUser.email,
      profilePic: currUser.profilePic,
      jobRole: currUser.jobRole,
      experience: currUser.experience,
      githubLink: currUser.githubLink,
      resume: currUser.resume,
    };

    res.render("profilePage/editProfile", {
      title: "Edit Profile",
      user,
      showLogout: true,
    });
  } catch (error) {
    //console.error("Error editing profile:", error);
    res.render("error", { message: "Error editing profile", status: 500})
  }
};

export const updateProfile = async (req, res) => {
  const profilePic = req.files["profilePic"]
  ? path.basename(req.files["profilePic"][0].path) // Extract only the file name
  : null;

 const resume = req.files["resume"]
  ? path.basename(req.files["resume"][0].path) // Extract only the file name
  : null;


  let {
    firstname,
    lastname,
    phone,
    email,
    jobRole,
    experience,
    githubLink,
  } = req.body;
  
  try {
    const update = {
      firstname,
      lastname,
      phone,
      email,
      profilePic,
      jobRole,
      experience,
      githubLink,
      resume,
    };
    const user = await User.findByIdAndUpdate(req.session.user.id, update, {
      new: true,
    }).lean();
  
    if (!user) {
      return res.render("error", { message: "User not found", status: 404})
    }
    res.redirect("/user/profile");
  } catch (error) {
    res.render("error", { message: "Error updating profile", status: 404})  }
};
