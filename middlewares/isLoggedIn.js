const jwt = require("jsonwebtoken");
const config = require("../config/serverConfig.js");
const { SECRET_KEY } = config;

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token || "";

    if (!token)
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded)
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Some error occurred at isLoggedIn middleware.." });
  }
};

module.exports = isLoggedIn;
