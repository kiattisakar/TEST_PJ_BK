const DB = require("../../configurations/db");
const Formatted = require("./formatted.data");
// const TB_N = "n_devices";
const TB_U = "users";
const jwt = require("jsonwebtoken");

const getMe = async (req, res) => {
  console.log("getMe");
  console.log(
    "1111111111111111111111111111111111111111111111111111111111111111"
  );
  // console.log(req);
  const barerHeader = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(barerHeader,process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('err'.err);
    } else {
      console.log('decoded',decoded);
      return decoded
    }
  });
  console.log(barerHeader);

  let sql = `SELECT * FROM ${TB_U} WHERE user_id = ${decoded.user_id}`;
  console.log(sql);
  DB.query(sql, { type: DB.QueryTypes.SELECT })

    .then((results) => {
      console.log("nodes : ", results);
      res.json({ status: "Success", me: results });
    })
    .catch((err) => {
      res.json({ status: "Error", message: err });
    });
};

module.exports = {
  getMe,
};
