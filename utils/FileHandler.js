const { SyncedTool } = require("../constant");
const path = require("path");
const fs = require("fs");
const { json } = require("body-parser");

module.exports.GetFile = async (req, res, next) => {
  const { foldername, filename } = req.params;
  try {
    const file = path.format({
      dir: SyncedTool.root,
      base: foldername + "/" + filename,
    });
    res.download(file);
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetFileNames = async (req, res, next) => {
  const { foldername } = req.params;
  try {
    const folder = path.format({
      dir: SyncedTool.root,
      base: foldername,
    });
    const filenames = fs.readdirSync(folder);
    return res.json({ filenames: filenames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetWorkOrders = async (req, res, next) => {
  try {
    const folder = path.format({
      dir: SyncedTool.root,
    });
    const foldernames = fs.readdirSync(folder);
    return res.json({ foldernames: foldernames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};
