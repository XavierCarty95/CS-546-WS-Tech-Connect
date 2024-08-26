
import SavedHistory from './saved_history.model.js';


export const createSavedHistory = async (req, res) => {
  try {
    const newApplicant = { 
      name: req.body.name, 
      job_id: req.body.Job_id, // Ensure this matches your schema
      date_applied: new Date(req.body.date_applied), // Parse the date correctly
      user_id: req.body.user_id
    };

  let savedHistory = await SavedHistory.findOne({}).lean();

  
  if (!savedHistory) {
      // If no SavedHistory exists, create a new one
      savedHistory = new SavedHistory({
          applicants: [newApplicant]
      });
      savedHistory.save()
  } else { 
    savedHistory.applicants.push(newApplicant);
  }

  const savedHistoryObject = savedHistory.toObject();
const applicants = savedHistoryObject.applicants;
    res.status(200).render("savedHistory", { applicants: applicants, showLogout: true })
  } catch (error) {
<<<<<<< HEAD
    // Handle any errors that occur during the process
    res.render("error", { message: "Error creating saved history", status: 500})  }
=======
    res.status(500).json({ message: 'Error creating saved history', error: error.message });
  }
>>>>>>> 7611f82 (pull)
};


export const getAllSavedHistories = async (req, res) => {
  try {
<<<<<<< HEAD
    const histories = await SavedHistory.find({}).lean();
    res.status(200).render('saved_jobs/savedJobs', { title: "SavedHistory Feed", histories, showLogout: true });
  } catch (error) {
    res.render("error", { message: "Error fetching saved histories", status: 500})  }
=======
    const applicants = await SavedHistory.findOne({}).lean();

    let listOfApplicants = []
    if(!applicants) { 
      console.log("no applicants")
    } else { 
      listOfApplicants = applicants
    }
    res.status(200).render('savedHistory', { applicants: listOfApplicants.applicants, showLogout: true });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved histories', error: error.message });
  }
>>>>>>> 7611f82 (pull)
};

export const deleteSavedPost = async (req, res) => {
  try {
    console.log(req.body)
    const post = await SavedHistory.findByIdAndDelete(req.params.id, { deleted: true });
    const histories = await SavedHistory.find({}).lean();
<<<<<<< HEAD
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
=======
    res.status(200).redirect('savedHistory', { applicants: histories.applicants, showLogout: true })

  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
>>>>>>> 7611f82 (pull)
