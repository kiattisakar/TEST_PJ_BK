const DB = require("../../configurations/db");
const Formatted = require("./formatted.data");
const short = require("short-uuid");
// const TB_N = "n_devices";
const TB_N = "devices";
const TB_SS = "data_node";
const TB_MD = "station_mode";

const getDevices = (req, res) => {
  console.log("getDevices");
  console.log(req.body);
  let sql = `SELECT * FROM ${TB_N}`;
  DB.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing the query:", err);
      res.json({ status: "Error", message: err });
      return;
    }
    res.json({ status: "Success", devices: result });
  });
};

const getDevicesByUID = async (req, res) => {
  console.log("getDevicesByUID");
  const U_ID = req.params.user_id;
  const sql = `SELECT * FROM ${TB_N} WHERE user_id = ?`;
  const value = [U_ID];
  console.log(sql);
  DB.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error executing the query:", err);
      res.json({ status: "Error", message: err });
      return;
    }
    res.json({ status: "Success", devices: result });
  });
};

const getSenser = async (req, res) => {
  const nodeId = req.params.nodeId;
  console.log("getSenser", nodeId);
  const sql = `SELECT * FROM ${TB_SS} WHERE node_id = ${nodeId} ORDER BY data_id DESC LIMIT 1 `;
  console.log(sql);
  DB.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing the query:", err);
      res.json({ status: "Error", message: err.message });
      return;
    }
    res.json({ status: "Success", senser: results });
  });
};

const postDataNode = async (req, res) => {
  console.log("postDataNode");
  const data = req.body;
  const nodeID = parseInt(data.node_id, 10);
  console.log(nodeID);
  console.log(data);
  const Date = Formatted.fomattedDate();
  const Time = Formatted.fomattedTime();
  console.log(Date, Time);
  if (isNaN(nodeID)) {
    console.log("Invalid node_id. Unable to convert to an integer.");
    res
      .status(400)
      .json({ error: "Invalid node_id. Unable to convert to an integer." });
    return;
  }
  const insertsql = `INSERT INTO ${TB_SS} (level, air_temp, air_humi, date, time, node_id) VALUES (?,?,?,?,?,?)`;
  const value = [
    data.level,
    data.air_temp,
    data.air_humi,
    // data.soil_mois,
    // data.light,
    Date,
    Time,
    nodeID,
  ];
  DB.query(insertsql, value, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err, code: "500" });
      console.log(err);
    }
    res.json({
      status: "Success",
      code: "200",
      message: "Node Data added successfully",
    });
  });
};

const getAllSenserChartData = async (req, res) => {
  console.log("getAllSenserData", req.params.nodeId);
  const nodeId = req.params.nodeId;
  console.log(nodeId);
  let sql = `SELECT * FROM ${TB_SS} WHERE node_id = ${nodeId}`;
  console.log(sql);
  DB.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "Error", message: err });
    }
    res.json({ status: "Success", chart: result });
  });
};
const getChartData = async (req, res) => {
  console.log("getAllSenserData", req.params.nodeId);
  const nodeId = req.params.nodeId;
  const data = req.params.data;
  let sql = `SELECT ${data}, date, time FROM ${TB_SS} WHERE node_id = ${nodeId} `;
  console.log(sql);

  DB.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "Error", message: err });
    }
    res.json({ status: "Success", oneChart: result });
  });
};
const postSetDataMode = (req, res) => {
  console.log("postSetDataMode");
  const ID = req.params.nodeId;
  const fomattedDate = Formatted.fomattedDate();
  const fomattedTime = Formatted.fomattedTime();
  const countQuery = `SELECT COUNT(*) as count FROM ${TB_MD} WHERE devices_node_id = ?`;
  const countValue = [ID];
  const insertSql = `INSERT INTO ${TB_MD} (pump_st, current_level, go_level, st_mode, start_date, start_time, devices_node_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const insertValues = [
    "OFF",
    "0",
    "0",
    "NONE",
    fomattedDate,
    fomattedTime,
    ID,
  ];
  DB.query(countQuery, countValue, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: "error", message: err.message, code: "500" });
    }

    console.log(countQuery);
    const count = result[0].count;
    console.log(count);
    if (count === 0) {
      DB.query(insertSql, insertValues, (err, value) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ status: "error", message: err.message, code: "500" });
        }
        return res.json({
          status: "Success",
          code: "200",
          message: "Node Data added successfully",
        });
      });
    } else {
      return res.json({
        status: "error",
        message: "Node Data already exists",
        code: "409",
      });
    }
  });
};
const getModeData = async (req, res) => {
  console.log("getModeData", req.params.nodeId);
  console.log(req.params);
  const nodeId = req.params.nodeId;
  let sql = `SELECT *  FROM ${TB_MD} WHERE devices_node_id = ${nodeId} `;
  console.log(sql);

  DB.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "Error", message: err });
    } else {
      console.log("mode : ", result);
      res.json({ status: "Success", mode: result });
    }
  });
};

const putMode = async (req, res) => {
  console.log("put mode");
  const nodeId = req.params.nodeId;
  console.log('PUT station ID : ',nodeId);
  const data = req.body;
  console.log(data);
  const date = Formatted.fomattedDate();
  const time = Formatted.fomattedTime();
  const sql = `UPDATE ${TB_MD} SET
  pump_st = ?,
  current_level = ?,
  go_level = ?,
  st_mode = ?,
  start_date = ?,
  start_time = ?
  WHERE devices_node_id = ?`;
  const succSql = `UPDATE ${TB_MD} SET
  pump_st = ?,
  current_level = ?,
  go_level = ?,
  st_mode = ?,
  succ_date = ?,
  succ_time = ?
  WHERE devices_node_id = ?`;
  const value = [
    data.pump_st,
    data.current_level,
    data.go_level,
    data.st_mode,
    date,
    time,
    nodeId,
  ];
if(data.state === "END"){
  DB.query(succSql, value, (err, result) => {

    if (err) {
      console.error("Error updating mode:", err);
      res.status(500).json({ status: "Error", message: err.message });
    } else {
      const count = result.affectedRows;
      if (count > 0) {
        return res
          .status(200)
          .json({ status: "Success", message: "Mode updated successfully" });
      } else {
        return res
          .status(404)
          .json({ status: "Error", message: "Unsuccessful Mode update" });
      }
    }
  });
}else{
  DB.query(sql, value, (err, result) => {   // console.log(result);
    if (err) {
      console.error("Error updating mode:", err);
      res.status(500).json({ status: "Error", message: err.message });
    } else {
      const count = result.affectedRows;
      if (count > 0) {
        return res
          .status(200)
          .json({ status: "Success", message: "Mode updated successfully" });
      } else {
        return res
          .status(404)
          .json({ status: "Error", message: "Unsuccessful Mode update" });
      }
    }
  });
}
};
const addDevice = async (req, res) => {
  console.log("addDevice");
  const uniqeId = short.generate();
  console.log(uniqeId);
  const ID = req.params.nodeId;
  const data = req.body;
  const insertsql = `
    INSERT INTO ${TB_N} (d_name, type, lat, lon, status, user_id, uniqe_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const insertValues = [
    data.d_name,
    data.type,
    data.lat,
    data.lon,
    1,
    data.user_id,
    uniqeId,
  ];

  DB.query(insertsql, insertValues, (err, value) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: "error", message: err.message, code: "500" });
    }
    return res.json({
      status: "Success",
      code: "200",
      message: "Device added successfully",
    });
  });
};




module.exports = {
  getDevices,
  getDevicesByUID,
  postDataNode,
  getSenser,
  getAllSenserChartData,
  getChartData,
  postSetDataMode,
  getModeData,
  putMode,
  addDevice,
};

