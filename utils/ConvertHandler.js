const path = require("path");
const fs = require("fs");
const { SyncedTool } = require("../constant");
var toPdf = require("custom-soffice-to-pdf");

module.exports.GetPDFFile = async (req, res, next) => {
  const { foldername, filename } = req.params;
  try {
    const filePath = path.join(__dirname, "../../ForwardSignWeb-temp");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const outputPath = path.join(
      filePath,
      `${filename.replace(".docx", ".pdf").replace(".xlsx", ".pdf")}`
    );
    const file = path.format({
      dir: SyncedTool.root,
      base: foldername + "/" + filename,
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
