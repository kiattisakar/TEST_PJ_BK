const line = require("../controllers/line");
const path = require("path");

const redirect = async (req, res) => {
  console.error("line redirect");
  try {
    await line.lToken(req.query.code, req.query.state);
    console.log("00000");
    res.sendFile(path.join(__dirname, "../../views", "line-connected.html"));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    console.log(errorMessage);
    res.status(500).json({ redirect_error: errorMessage });
  }
};

const notify = async (req, res) => {
  console.log('in notify');
  console.log(req.body.token);
  try {
    if(req.body.token === undefined){
      return res.status(401).send({ message: "Notify Unsuccess." });
    }else{
      await line.sendLineNotify(req.body.message, req.body.token);
    return res.status(200).send({ message: "Notify Successfully." });
    }
  } catch (error) {
    return res.json({ error: error.response.data.message });
  }
};
module.exports = {
  redirect,
  notify,
};
