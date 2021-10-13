const mongoUtil = require("./mongoUtil");

const encodeData = (data) => {
  return Buffer.from(data).toString("base64");
};

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    let encode = encodeData(`${password}`);
    const db = mongoUtil.getDb();
    const results = await db
      .collection("users")
      .find({ email: userName, password: encode })
      .toArray();
    if (results !== null && results.length === 1) {
      if (results[0].isActive) {
        return res.json({
          token: results[0].token,
          firstName: results[0].firstName,
        });
      } else {
        return res.json({
          token: "0000",
          firstName: "",
        });
      }
    } else {
      __logger.warn(
        "Cannot find username:" + userName + " and password:" + encode
      );
      return res.json({ token: "", firstName: "" });
    }
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};
