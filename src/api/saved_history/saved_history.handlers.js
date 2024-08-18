import SavedHistory from './saved_history.model.js';

// Create a new saved history entry
export const createSavedHistory = async (req, res) => {
  try {
    const { Applicant_Name, Job_id, Applied_datetime } = req.body;

    const newHistory = new SavedHistory({
      Applicant_Name,
      Job_id,
      Applied_datetime,
    });

    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating saved history', error });
  }
};

// Get all saved history entries
export const getAllSavedHistories = async (req, res) => {
  try {
    const histories = await SavedHistory.find();
    const savedJobs = [
      // Example data; replace with your actual database query
      { Applicant_Name: "John Doe", Job_id: "12345", Applied_datetime: "2024-08-01 10:00 AM" },
      { Applicant_Name: "Jane Smith", Job_id: "67890", Applied_datetime: "2024-08-02 2:00 PM" },
  ];
    res.status(200).render('saved_jobs/savedJobs', { savedJobs, showLogout: true })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved histories', error });
  }
};

