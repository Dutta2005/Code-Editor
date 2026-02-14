import CodeHistory from "../models/CodeHistory.js";

export const createHistory = async (req, res) => {
  try {
    const { title, language, code } = req.body;

    if (!title || !language || !code) {
      return res.status(400).json({ message: "title, language and code are required." });
    }

    const entry = await CodeHistory.create({
      user: req.user.id,
      title,
      language,
      code,
    });

    return res.status(201).json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save code history.", error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const entries = await CodeHistory.find({ user: req.user.id }).sort({ updatedAt: -1 });
    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch history.", error: error.message });
  }
};

export const updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, language, code } = req.body;

    const entry = await CodeHistory.findOne({ _id: id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ message: "History entry not found." });
    }

    if (title) entry.title = title;
    if (language) entry.language = language;
    if (code) entry.code = code;

    await entry.save();

    return res.json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update history.", error: error.message });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await CodeHistory.findOneAndDelete({ _id: id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ message: "History entry not found." });
    }

    return res.json({ message: "History entry deleted.", id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete history.", error: error.message });
  }
};
