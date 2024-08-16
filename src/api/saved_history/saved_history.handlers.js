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
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved histories', error });
  }
};

