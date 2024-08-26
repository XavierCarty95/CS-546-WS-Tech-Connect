
import SavedHistory from './saved_history.model.js';


export const createSavedHistory = async (req, res) => {
  try {
    console.log(req.body.Job_id);
    
    const newApplicant = { 
      name: req.body.name, 
      job_id: req.body.Job_id,
      date_applied: new Date(),
      user_id: req.body.user_id
    };

    let savedHistory = await SavedHistory.findOne({});

    if (!savedHistory) {

      savedHistory = new SavedHistory({
        applicants: [newApplicant]
      });
    } else {
      savedHistory.applicants.push(newApplicant);
    }

    await savedHistory.save();

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
      { 'applicants._id': req.params.id },
      { $pull: { applicants: { _id: req.params.id } } }, 
      { new: true }
    );

    const saved = await SavedHistory.findOne({})
    res.status(200).render("savedHistory", {  title: "SavedHistory Feed", applicants: saved.toObject().applicants, showLogout: true })
  } catch (error) {
    console.log(error.message)
    res.render("error", { message: "Error deleting post", status: 500})  }
};
