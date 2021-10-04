switch (process.env.REACT_APP_DEV) {
  case "dev":
    module.exports = {
      backendHost: "http://localhost:5000/",
    };
    break;
  case "production":
    module.exports = {
      backendHost: "https://localhost:5000/",
    };
    break;
  default:
    break;
}
