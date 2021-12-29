const { SyncedTool } = require("../constant");
const path = require("path");
const fs = require("fs");
const { json } = require("body-parser");

module.exports.GetFile_WO = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, filename } = req.params;
  try {
    const file = path.format({
      dir:
        SyncedTool.root + "/" + year + "/" + projectCreator + "/" + projectName,
      base: workOrder + "/" + filename,
    });
    res.download(file);
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetFile_Item = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, item, filename } =
    req.params;
  try {
    const file = path.format({
      dir:
        SyncedTool.root +
        "/" +
        year +
        "/" +
        projectCreator +
        "/" +
        projectName +
        "/" +
        workOrder,
      base: item + "/" + filename,
    });
    res.download(file);
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetFileNames_WO = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder } = req.params;
  try {
    const folder = path.format({
      dir:
        SyncedTool.root + "/" + year + "/" + projectCreator + "/" + projectName,
      base: workOrder,
    });
    const filenames = fs.readdirSync(folder);
    return res.json({ filenames: filenames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetFileNames_Item = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, item } = req.params;
  try {
    const folder = path.format({
      dir:
        SyncedTool.root +
        "/" +
        year +
        "/" +
        projectCreator +
        "/" +
        projectName +
        "/" +
        workOrder,
      base: item,
    });
    const filenames = fs.readdirSync(folder);
    return res.json({ filenames: filenames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetYear = async (req, res, next) => {
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

module.exports.GetProjectCreator = async (req, res, next) => {
  const { year } = req.params;
  try {
    const folder = path.format({
      dir: SyncedTool.root + "/" + year,
    });
    const foldernames = fs.readdirSync(folder);
    return res.json({ foldernames: foldernames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetProjectName = async (req, res, next) => {
  const { year, projectCreator } = req.params;
  try {
    const folder = path.format({
      dir: SyncedTool.root + "/" + year + "/" + projectCreator,
    });
    const foldernames = fs.readdirSync(folder);
    return res.json({ foldernames: foldernames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetWorkOrder = async (req, res, next) => {
  const { year, projectCreator, projectName } = req.params;
  try {
    const folder = path.format({
      dir:
        SyncedTool.root + "/" + year + "/" + projectCreator + "/" + projectName,
    });

    const foldernames = fs
      .readdirSync(folder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return res.json({ foldernames: foldernames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetItem = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder } = req.params;
  try {
    const folder = path.format({
      dir:
        SyncedTool.root +
        "/" +
        year +
        "/" +
        projectCreator +
        "/" +
        projectName +
        "/" +
        workOrder,
    });
    //const foldernames = fs.readdirSync(folder);

    const foldernames = fs
      .readdirSync(folder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return res.json({ foldernames: foldernames });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetAncestors = async (req, res, next) => {
  const { workOrder } = req.params;
  try {
    const folder = path.format({
      dir: SyncedTool.root,
    });
    let _year = "";
    let _pc = "";
    let _pn = "";
    let found = false;

    const yearfolders = fs
      .readdirSync(folder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (let year of yearfolders) {
      const pcfolders = fs
        .readdirSync(folder + "/" + year, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      for (let pc of pcfolders) {
        const pnfolders = fs
          .readdirSync(folder + "/" + year + "/" + pc, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);
        for (let pn of pnfolders) {
          const wofolders = fs
            .readdirSync(folder + "/" + year + "/" + pc + "/" + pn, {
              withFileTypes: true,
            })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
          if (wofolders.indexOf(workOrder) >= 0) {
            _pn = pn;
            found = true;
            break;
          }
        }
        if (found) {
          _pc = pc;
          break;
        }
      }
      if (found) {
        _year = year;
        break;
      }
    }

    console.log(
      `year: ${_year}, project creator: ${_pn}, project name: ${_pn}, work order: ${workOrder}`
    );

    return res.json({
      year: _year,
      pc: _pc,
      pn: _pn,
      wo: workOrder,
    });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};
