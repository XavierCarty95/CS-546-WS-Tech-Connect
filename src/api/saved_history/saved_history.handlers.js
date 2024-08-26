
import SavedHistory from './saved_history.model.js';


export const createSavedHistory = async (req, res) => {
  try {
    console.log(req.body.Job_id);
    
    const newApplicant = { 
      name: req.body.name, 
      job_id: req.body.Job_id, // Ensure this matches your schema
      date_applied: new Date(), // Parse the date correctly
      user_id: req.body.user_id
    };

    // Find the existing SavedHistory document without using .lean()
    let savedHistory = await SavedHistory.findOne({});

    if (!savedHistory) {
      // If no SavedHistory exists, create a new one
      savedHistory = new SavedHistory({
        applicants: [newApplicant]
      });
    } else {
      // If SavedHistory exists, add the new applicant to the array
      savedHistory.applicants.push(newApplicant);
    }

    // Save the document (either newly created or updated)
    await savedHistory.save();

    // Convert to plain object after saving
    const applicantObj = savedHistory.toObject();
    const applicants = applicantObj.applicants;

    res.status(200).render("savedHistory", { applicants: applicants, showLogout: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("error", { message: "Error creating saved history", status: 500 });
  }
};

export const getAllSavedHistories = async (req, res) => {
  try {
    const histories = await SavedHistory.find({}).lean();
    res.status(200).render("savedHistory", { title: "SavedHistory Feed", histories, showLogout: true });
  } catch (error) {
    res.render("error", { message: "Error fetching saved histories", status: 500})  }
};

export const deleteSavedPost = async (req, res) => {
  try {
    console.log(req.body)
    const updatedHistory = await SavedHistory.findOneAndUpdate(
      { 'applicants._id': req.params.id }, // Find the document containing the applicant
      { $pull: { applicants: { _id: req.params.id } } }, // Use $pull to remove the applicant by ID
      { new: true } // Return the updated document
    );

    const saved = await SavedHistory.findOne({})

    res.status(200).render("savedHistory", {  title: "SavedHistory Feed", applicants: saved.toObject().applicants, showLogout: true })
  } catch (error) {
    console.log(error.message)
    res.render("error", { message: "Error deleting post", status: 500})  }
};
