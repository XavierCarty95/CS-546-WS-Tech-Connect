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
    res.render("error", { message: "Error creating saved history", status: 500})  }
};


export const getAllSavedHistories = async (req, res) => {
  try {
    const histories = await SavedHistory.find({}).lean();
    res.status(200).render('saved_jobs/savedJobs', { title: "SavedHistory Feed", histories, showLogout: true });
  } catch (error) {
    res.render("error", { message: "Error fetching saved histories", status: 500})  }
};

export const deleteSavedPost = async (req, res) => {
  try {
    const post = await SavedHistory.findByIdAndDelete(req.params.id);
    const histories = await SavedHistory.find({}).lean();
    res.status(200).render('saved_jobs/savedJobs', {  title: "SavedHistory Feed", histories, showLogout: true })
    if (!post) {
      res.render("error", { message: "Post not found", status: 404})    }



  } catch (error) {
    res.render("error", { message: "Error deleting post", status: 500})  }
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