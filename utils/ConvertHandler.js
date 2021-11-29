const path = require("path");
const fs = require("fs");
const { SyncedTool } = require("../constant");
var toPdf = require("custom-soffice-to-pdf");
const imagesToPdf = require("images-to-pdf");

module.exports.GetPDFFile_WO = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, filename } = req.params;
  try {
    const filePath = path.join(__dirname, "../../ForwardSignWeb-temp");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const outputPath = path.join(
      filePath,
      `${filename
        .replace(".docx", ".pdf")
        .replace(".xlsx", ".pdf")
        .replace(".pptx", ".pdf")}`
    );
    const file = path.format({
      dir: SyncedTool.root + '/' + year + '/' + projectCreator + '/' + projectName,
      base: workOrder + "/" + filename,
    });

    const fileContent = fs.readFileSync(file);
    var pdfBuffer = await toPdf(fileContent);
    fs.writeFileSync(outputPath, pdfBuffer);
    //res.download(outputPath);
    res.download(outputPath, (err) => {
      if (err) {
        console.log(err);
      }
      fs.unlink(outputPath, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("FILE [" + filename + "] REMOVED!");
      });
    });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetPDFFile_Item = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, item, filename } = req.params;
  try {
    const filePath = path.join(__dirname, "../../ForwardSignWeb-temp");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const outputPath = path.join(
      filePath,
      `${filename
        .replace(".docx", ".pdf")
        .replace(".xlsx", ".pdf")
        .replace(".pptx", ".pdf")}`
    );
    const file = path.format({
      dir: SyncedTool.root + '/' + year + '/' + projectCreator + '/' + projectName + '/' + workOrder,
      base: item + "/" + filename,
    });

    const fileContent = fs.readFileSync(file);
    var pdfBuffer = await toPdf(fileContent);
    fs.writeFileSync(outputPath, pdfBuffer);
    res.download(outputPath, (err) => {
      if (err) {
        console.log(err);
      }
      fs.unlink(outputPath, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("FILE [" + filename + "] REMOVED!");
      });
    });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetPDFFromImages_WO = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, filename } = req.params;
  try {
    const filePath = path.join(__dirname, "../../ForwardSignWeb-temp");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const outputPath = path.join(
      filePath,
      `${filename
        .replace(".jpg", ".pdf")
        .replace(".png", ".pdf")
        .replace(".jpeg", ".pdf")}`
    );
    const file = path.format({
      dir: SyncedTool.root + '/' + year + '/' + projectCreator + '/' + projectName,
      base: workOrder + "/" + filename,
    });

    await imagesToPdf([file], outputPath);
    res.download(outputPath, (err) => {
      if (err) {
        console.log(err);
      }
      fs.unlink(outputPath, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("FILE [" + filename + "] REMOVED!");
      });
    });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};

module.exports.GetPDFFromImages_Item = async (req, res, next) => {
  const { year, projectCreator, projectName, workOrder, item, filename } = req.params;
  try {
    const filePath = path.join(__dirname, "../../ForwardSignWeb-temp");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const outputPath = path.join(
      filePath,
      `${filename
        .replace(".jpg", ".pdf")
        .replace(".png", ".pdf")
        .replace(".jpeg", ".pdf")}`
    );
    const file = path.format({
      dir: SyncedTool.root + '/' + year + '/' + projectCreator + '/' + projectName + '/' + workOrder,
      base: item + "/" + filename,
    });

    await imagesToPdf([file], outputPath);
    res.download(outputPath, (err) => {
      if (err) {
        console.log(err);
      }
      fs.unlink(outputPath, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("FILE [" + filename + "] REMOVED!");
      });
    });
  } catch (e) {
    console.log(e);
    __logger.error(e);
    next();
  }
};
