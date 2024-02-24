const controllers = require("../controllers");

const userRoutes = (app) => {
  app.post('/register', controllers.users.userRegister);
  app.post('/login', controllers.users.userLogin);
  app.post('/authen', controllers.users.authen);
  app.get('/users', controllers.users.getUsers);
  app.get('/user/id/:userId', controllers.users.getUserById);
  app.get('/user/username/:username', controllers.users.getUserByUsername);
  app.put('/user', controllers.users.putUser);
  app.delete('/thisuser/:user_id', controllers.users.deleteUser);
};

const nodeRoutes = (app) => {
  app.get('/devices', controllers.nodes.getDevices);
  app.get('/devices/:user_id', controllers.nodes.getDevicesByUID);
  app.post('/nodes', controllers.nodes.postDataNode);
  // app.get('/station', controllers.nodes.getStation);
  app.get('/senser/:nodeId', controllers.nodes.getSenser);
  app.get('/chart_ss/:nodeId', controllers.nodes.getAllSenserChartData);
  app.get('/chart_ss/:nodeId/:data', controllers.nodes.getChartData);
  app.post('/mode/:nodeId', controllers.nodes.postSetDataMode);
  app.get('/mode/:nodeId', controllers.nodes.getModeData);
  app.put('/mode/:nodeId', controllers.nodes.putMode);
  app.post('/add-device', controllers.nodes.addDevice);
};

const lineRoutes = (app) => {
  app.get('/line/redirect', controllers.lineredirect.redirect);
  app.post('/line/notify', controllers.lineredirect.notify)
};

const auteMe = (app) =>{
  app.get('/auth/me',controllers.auth.getMe)

}
module.exports = {
  userRoutes,
  nodeRoutes,
  lineRoutes,
  auteMe
};
