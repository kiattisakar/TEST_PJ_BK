const axios = require("axios");
const qs = require("qs");
const DB = require("../../configurations/db");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const LINE_API_URI = process.env.LINE_API_URI;
const CALLBACK_URI = process.env.CALLBACK_URI;

const lToken = async (code, userID) => {
  console.log("get Line Token");
  const res = await axios.post(
    LINE_API_URI,
    qs.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: CALLBACK_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log(`Get Token: at userID = ${userID}`, res.data.access_token);

  const sql = `UPDATE users SET line_acctk = ? WHERE user_id = ?`;
  const value = [res.data.access_token, userID];
  console.log(sql);
  DB.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error:", error.response.data.message);
      return err;
    } else {
      if(result.affectedRows === 1){
        console.log("User data updated:");
      return res.data;
      }
    }
  });
};
const sendLineNotify = async (message, accessToken) => {
  const LINE_NOTIFY_URI = "https://notify-api.line.me/api/notify";

  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer " + accessToken,
  };
  await axios
    .post(LINE_NOTIFY_URI, qs.stringify({ message }), { headers: header })
    .then((response) => {
      console.log("Status:", response.status);
      console.log("Data:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.response.status);
      console.error("Message:", error.response.data.message);
    });
};

module.exports = {
  lToken,
  sendLineNotify,
};
