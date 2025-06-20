// controllers/journalController.js
const Journal = require("../models/Journal");
const { journalSchema } = require("../validators/JournalValidator");
const { getJournalInsights } = require("../helper/groq");

// exports.createJournal = async (req, res) => {
//   try {
//     const parseResult = journalSchema.safeParse(req.body);

//     if (!parseResult.success) {
//       const errors = parseResult.error.format();
//       return res.status(400).json({ message: "Validation failed", errors });
//     }

//     const { text } = parseResult.data;

//     const newJournal = await Journal.create({
//       user: req.user._id,
//       text,
//     });

//     res.status(201).json({ message: "Journal saved", journal: newJournal });
//   } catch (err) {
//     console.error("Error saving journal:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.createJournal = async (req, res) => {
  try {
    const parseResult = journalSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.format();
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { text } = parseResult.data;

    // Step 1: Save journal in MongoDB
    const journal = await Journal.create({
      user: req.user._id,
      text,
    });

    // Step 2: Get AI insights
    const aiInsights = await getJournalInsights(text);

    // Step 3: Send embedding to Pinecone , from here we are sending our journal for embedding and store into pinecode.
    await fetch("http://localhost:6000/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `journal_${journal._id}`,
        text,
        summary: aiInsights.summary,
        userId: req.user._id.toString(),
        createdAt: journal.createdAt,
      }),
    });

    // Step 4: Update AI insights in MongoDB
    journal.aiInsights = aiInsights;
    await journal.save();

    res.status(201).json({ message: "Journal saved", journal });
  } catch (err) {
    console.error("Error saving journal:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJournals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const totalJournals = await Journal.countDocuments({ user: req.user._id });

    // const journals = await Journal.find({ user: req.user._id })
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .select("text createdAt"); // optimization: only send needed fields

    const journals = await Journal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + journals.length < totalJournals;

    res.json({ journals, hasMore });
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).json({ message: "Server error" });
  }
};
