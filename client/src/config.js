switch (process.env.REACT_APP_DEV) {
  case "dev":
    module.exports = {
      backendHost: "http://localhost:5000/",
    };
    break;
  case "prod":
    module.exports = {
      backendHost: "http://192.69.134.89:3001/",
    };
    break;
  default:
    break;
}
