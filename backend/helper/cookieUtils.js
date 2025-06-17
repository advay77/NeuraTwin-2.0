const setAuthCookie = (res, token) => {
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const setTempCookie = (res, email) => {
  res.cookie("temp_token", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });
};
// exports.clearTempCookie = (res) => {
//   res.clearCookie("temp_token");
// };

module.exports = { setAuthCookie, setTempCookie };
