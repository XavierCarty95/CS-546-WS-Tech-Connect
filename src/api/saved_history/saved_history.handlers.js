import SavedHistory from './saved_history.model.js';

export const createSavedHistory = async (req, res) => {
  try {
    // Assuming user info is stored in the session
    const applicantName = req.session.user.firstname;

    // Get other data from the request body
    const { Job_id } = req.body;

    // Create a new SavedHistory record
    const newHistory = new SavedHistory({
      Applicant_Name: applicantName, // Set the applicant name from session
      Job_id,
      Applied_datetime: new Date(),
      user_id: req.session.user.id
    });

    await newHistory.save();


    res.status(201).json(newHistory);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: 'Error creating saved history', error });
  }
};


export const getAllSavedHistories = async (req, res) => {
  try {
    const histories = await SavedHistory.find({}).lean();
    res.status(200).render('saved_jobs/savedJobs', { histories, showLogout: true });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved histories', error });
  }
};

export const deleteSavedPost = async (req, res) => {
  try {
    const post = await SavedHistory.findByIdAndDelete(req.params.id);
    const histories = await SavedHistory.find({}).lean();
    res.status(200).render('saved_jobs/savedJobs', { histories, showLogout: true })
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }



  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export const saveApplicant = async (req, res) => {
  console.log("IN SAVE")
  console.log("req.body", req.body)
  const uhh = await SavedHistory.findById(req.body.applicant_id)
  console.log("uhhh", uhh)
  /*const job = await SavedHistory.findById(req.body.Job_id)
  console.log("JOBB", job)
  const applicant = await SavedHistory.findById(req.body.applicant.user_id)
  console.log("APPLICANT", applicant)*/

}