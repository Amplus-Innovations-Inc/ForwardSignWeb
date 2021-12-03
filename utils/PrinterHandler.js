const { print } = require("pdf-to-printer");
const { SyncedTool } = require("../constant");
const path = require("path");
const fs = require("fs");
var toPdf = require("custom-soffice-to-pdf");
const dotenv = require("dotenv");

dotenv.config();

module.exports.PrintFile = async (req, res, next) => {
  const { filename, year, pc, pn, wo } = req.body;
  try {
    const options = {
      printer: `${process.env.Printer}`,
    };

    const file = path.format({
      dir: SyncedTool.root + "/" + year + "/" + pc + "/" + pn,
      base: wo + "/" + filename,
    });
    const fileExt = filename
      .substr(filename.lastIndexOf(".") + 1)
      .toLowerCase();

    if (fileExt === "docx" || fileExt === "xlsx" || fileExt === "pptx") {
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

      const fileContent = fs.readFileSync(file);
      var pdfBuffer = await toPdf(fileContent);
      fs.writeFileSync(outputPath, pdfBuffer);
      print(outputPath, options).then(() => {
        res.json({ status: true });
      });
    } else {
      print(file, options).then(() => {
        res.json({ status: true });
      });
    }
  } catch (e) {
    console.log(e);
    res.json({ status: false });
  }
};
