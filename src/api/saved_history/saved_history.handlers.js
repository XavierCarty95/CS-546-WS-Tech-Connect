import SavedHistory from './saved_history.model.js';

// Create a new saved history entry
export const createSavedHistory = async (req, res) => {
  try {
    // Assuming user info is stored in the session
    const applicantName = req.session.user.firstname; // Adjust according to how user info is stored in your session

    // Get other data from the request body
    const { Job_id } = req.body;

    console.log(req.body)

    // Create a new SavedHistory record
    const newHistory = new SavedHistory({
      Applicant_Name: applicantName, // Set the applicant name from session
      Job_id,
      Applied_datetime: new Date(),
    });

    console.log("Printed")
    // Save the record to the database
    await newHistory.save();

    // Respond with the created history record
    res.status(201).json(newHistory);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: 'Error creating saved history', error });
  }
};


// Get all saved history entries
export const getAllSavedHistories = async (req, res) => {
  try {
    const histories = await SavedHistory.find({}).lean();

     console.log(histories)
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