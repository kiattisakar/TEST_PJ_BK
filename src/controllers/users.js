const DB = require("../../configurations/db");
const Formatted = require("./formatted.data");
const bcrypt = require("bcrypt");
const TB = "users";
const {
  hash,
  pwdCompare,
} = require("../../configurations/middlefunc");
const jwt = require("jsonwebtoken");
// const SECRET = "KRMwitsaKrm";

// async function comparePasswords(dbPassword, enteredPassword) {
//   return dbPassword === enteredPassword;
// }
const userRegister = async (req, res) => {
  console.log("userRegister");
  const data = req.body;
  console.log(data);
  // const pwd = hashmd5(data.password);
  const pwd = await hash(data.password);
  console.log(pwd);
  const Date = Formatted.fomattedDate();

  const countQuery = `SELECT COUNT(*) as count FROM ${TB} WHERE username = ?`;
  const countValue = [data.username];
  const insertsql = `
      INSERT INTO ${TB} (date, username, password, f_name, l_name, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  const insertValue = [
    Date,
    data.username,
    pwd,
    data.f_name,
    data.l_name,
    data.role,
    1,
  ];

  DB.query(countQuery, countValue, (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ status: "Error", message: err.message });
    } else {
      const count = result[0].count;
      if (count > 0) {
        return res.json({
          status: "error",
          text: "This username is already in use!",
          code: "500",
        });
      } else {
        DB.query(insertsql, insertValue, (err, result) => {
          if (err) {
            console.error("Error creating user:", err);
            res.status(500).json({ status: "Error", message: err.message });
          } else {
            return res.json({
              status: "Success",
              code: "200",
              message: "User added successfully",
            });
          }
        });
      }
    }
  });
};
const userLogin = async (req, res) => {
  console.log("userLogin");
  const data = req.body;
  const pwd = data.password;
  const username = data.username;
  const sql = `SELECT * FROM ${TB} WHERE username = ?`;
  const value = [username];
  DB.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error Login:", err);
      res.status(500).json({ status: "Error", message: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ status: "User not found" });
      return;
    }
    if (typeof result[0].password !== "string") {
      return res
        .status(500)
        .json({ status: "Error", msg: "Invalid stored password format" });
    }
    const storedPwd = String(result[0].password);
    const isLogin =  pwdCompare(storedPwd, pwd);
    console.log({
      user_id: result[0].user_id,
      username: result[0].username,
      fistname: result[0].f_name,
    });
    if (isLogin) {
      const token = jwt.sign(
        {
          user_id: result[0].user_id,
          username: result[0].username,
          firstname: result[0].f_name,
          role: result[0].role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      res.status(200).json({ status: "Success", msg: "Login success", token });
    } else {
      res.status(401).json({ status: "Error", msg: "Password incorrect" });
    }
  });
};
const authen = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ status: "Verify", decoded });
  } catch (err) {
    res.status(401).json({ status: "error", msg: err.message });
  }
};
const getUsers = async (req, res) => {
  console.log("getUsers");
  const sql = `SELECT * FROM ${TB}`;
  DB.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ status: "Error", message: err.message });
    } else {
      res.json({ status: "Success", users: result });
    }
  });
};
const getUserById = async (req, res) => {
  console.log("getUserById");
  console.log(req.params);
  const userId = req.params.userId;
  const sql = `SELECT * FROM ${TB} WHERE user_id = ?`;
  const value = [userId];
  DB.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error fetching user by ID:", err);
      res.status(500).json({ status: "Error", message: err.message });
    } else {
      res.json({ status: "Success", users: result });
    }
  });
};
const getUserByUsername = async (req, res) => {
  console.log("getUserById");
  console.log("param", req.params);
  const username = req.params.username;
  const sql = `SELECT * FROM ${TB} WHERE username = ?`;
  const value = [username];
  DB.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error fetching user by username:", err);
      res.status(500).json({ status: "Error", message: err.message });
    }
    res.json({ status: "Success", user: result });
  });
};
const putUser = async (req, res) => {
  console.log("putUser");
  const data = req.body;
  const existingUser = DB.query(
    `SELECT * FROM ${TB} WHERE username = ${data.username}`,
    (err, result) => {
      if (existingUser.length > 0 && existingUser[0].user_id !== data.user_id) {
        return res.status(500).json({
          status: "Error",
          message: "User with the same username already exists",
        });
      } else {
        const sql = `UPDATE ${TB} SET
          f_name = ?,
          l_name = ?,
          username = ?,
          role = ?
        WHERE user_id = ?`;
        const value = [
          data.f_name,
          data.l_name,
          data.username,
          data.role,
          data.user_id,
        ];
        DB.query(sql, value, (err, result) => {
          if (err) {
            console.error("Error updating user:", error);
            res.status(500).json({ status: "Error", message: error.message });
          }
          console.log(result);
          const count = result.affectedRows;

          if (count > 0) {
            console.log(count);
            return res.status(200).json({
              status: "Success",
              message: "User updated successfully",
            });
          } else {
            return res
              .status(404)
              .json({ status: "Error", message: "User not found" });
          }
        });
      }
    }
  );
};

const deleteUser = async (req, res) => {
  console.log("deleteUser");
  const data = req.params;
  console.log(data);

  if (!data || !data.user_id) {
    console.log("Invalid input data");
    return res.status(400).json({ status: 400, message: "Invalid input data" });
  }

  const ID = parseInt(data.user_id, 10);
  console.log(ID);

  const countQuery = `SELECT COUNT(*) as count FROM ${TB} WHERE user_id = ?`;
  const countValue = [data.user_id];

  const sql = `DELETE FROM users WHERE user_id = ?`;
  const value = [data.user_id];

  console.log(countQuery);
  console.log(sql);

  DB.query(countQuery, countValue, (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res
        .status(500)
        .json({ status: "Error", message: "Internal Server Error" });
    } else {
      const count = result[0].count;
      console.log(count);

      if (count > 0) {
        DB.query(sql, value, (err, result) => {
          if (err) {
            console.error("Error deleting user:", err);
            return res
              .status(500)
              .json({ status: "Error", message: "Internal Server Error" });
          } else {
            console.log("User deleted successfully");
            return res.status(200).json({
              status: "Success",
              message: "User deleted successfully",
            });
          }
        });
      } else {
        console.log("User not found");
        return res
          .status(404)
          .json({ status: "Error", message: "User not found" });
      }
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  userRegister,
  userLogin,
  putUser,
  deleteUser,
  authen,
};
