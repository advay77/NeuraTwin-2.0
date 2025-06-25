// const setAuthCookie = (res, token) => {
//   res.cookie("auth_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     // sameSite: "none", // FIXED: allow cross-site cookies on POST
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
// };

// const setTempCookie = (res, email) => {
//   res.cookie("temp_token", email, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     // sameSite: "none", // FIXED: allow cross-site cookies on POST
//     maxAge: 10 * 60 * 1000,
//   });
// };

// module.exports = { setAuthCookie, setTempCookie };
res.cookie("auth_token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None", // ✅ MUST be None for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.cookie("temp_token", email, {
  httpOnly: true,
  secure: true,
  sameSite: "None", // ✅ Same here
  maxAge: 10 * 60 * 1000,
});

module.exports = { setAuthCookie, setTempCookie };
