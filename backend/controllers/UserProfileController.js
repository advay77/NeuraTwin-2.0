const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { setAuthCookie } = require("../helper/cookieUtils");
const { userProfileSchema } = require("../validators/UserProfileValidator");

exports.completeUserProfile = async (req, res) => {
  try {
    // Validate incoming data with Zod
    const parseResult = userProfileSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors,
      });
    }

    const {
      name,
      email,
      dateOfBirth,
      gender,
      occupation,
      goalTitle,
      goalDescription,
      goalStartDate,
      goalEndDate,
    } = parseResult.data;

    // ✅ Create new user directly
    const newUser = await User.create({
      name,
      email,
      dob: new Date(dateOfBirth),
      gender,
      occupation,
      avatar: "", // optional for now
      goals: [
        {
          title: goalTitle,
          description: goalDescription,
          startDate: new Date(goalStartDate),
          endDate: new Date(goalEndDate),
        },
      ],
    });

    // ✅ Clear temp cookie
    res.clearCookie("temp_token");

    // ✅ Set auth token
    const authToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    setAuthCookie(res, authToken);

    // ✅ Set firstLogin cookie (expires in 10 mins)
    // res.cookie("firstLogin", "true", {
    //   // httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Lax",
    //   maxAge: 10 * 60 * 1000, // 10 minutes
    // });
    res.cookie("firstLogin", "true", {
      secure: true,
      sameSite: "None", // ✅ Required for cross-site
      maxAge: 10 * 60 * 1000,
    });

    return res.status(201).json({ success: true, message: "Profile created." });
  } catch (err) {
    console.error("❌ Profile completion error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
