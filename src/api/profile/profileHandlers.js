import User from "../user/user.model.js";

export const renderProfile = async (req, res) => {
    const currUser = await User.findById(req.session.user.id)
    const fullname = (currUser.firstname + " " + currUser.lastname)
    const user = {
        name: fullname,
        role: currUser.role,
        phone: currUser.phone,
        email: currUser.email,
        companyID: currUser.companyID,
        profilePic: currUser.profilePic,
        jobRole: currUser.jobRole,
        experience: currUser.experience,
        githubLink: currUser.githubLink,
        resume: currUser.resume
    }
    res.render('profilePage/profile', { 
        title: 'Profile',
        user,
        showLogout: true
    });
};

export const editProfile = async (req, res) => {
    const currUser = await User.findById(req.session.user.id)
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
    }
    res.render('profilePage/editProfile', { 
        title: 'Edit Profile',
        user,
        showLogout: true
    });
};

export const updateProfile = async (req, res) => {
    let { name, phone, email, companyID, profilePic, jobRole, experience, githubLink, resume } = req.body;
    let firstname = name[0]
    let lastname = name[1]
    try {
        const update = { firstname, lastname, phone, email, companyID, profilePic, jobRole, experience, githubLink, resume };
        const user = await User.findByIdAndUpdate(req.session.user.id, update, {
            new: true,
        });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.redirect("/profile")
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  };