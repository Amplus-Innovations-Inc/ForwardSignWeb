const { Router } = require("express");
const { authenticateUser } = require("../database/userHandler");
const { GetPDFFile_WO, GetPDFFile_Item, GetPDFFromImages_WO, GetPDFFromImages_Item } = require("../utils/ConvertHandler");
const {
  GetFileNames_WO,
  GetFileNames_Item,
  GetFile_WO,
  GetFile_Item,
  GetYear,
  GetProjectCreator,
  GetProjectName,
  GetWorkOrder,
  GetItem
} = require("../utils/FileHandler");

const router = Router();

router.post("/login", authenticateUser);
router.get("/getFile_WO/:year/:projectCreator/:projectName/:workOrder/:filename", GetFile_WO);
router.get("/getFile_Item/:year/:projectCreator/:projectName/:workOrder/:item/:filename", GetFile_Item);

router.get("/getPDFFile_WO/:year/:projectCreator/:projectName/:workOrder/:filename", GetPDFFile_WO);
router.get("/getPDFFile_Item/:year/:projectCreator/:projectName/:workOrder/:item/:filename", GetPDFFile_Item);

router.get("/getPDFFromImages_WO/:year/:projectCreator/:projectName/:workOrder/:filename", GetPDFFromImages_WO);
router.get("/getPDFFromImages_Item/:year/:projectCreator/:projectName/:workOrder/:item/:filename", GetPDFFromImages_Item);

router.get("/getFileNames_WO/:year/:projectCreator/:projectName/:workOrder", GetFileNames_WO);
router.get("/getFileNames_Item/:year/:projectCreator/:projectName/:workOrder/:item", GetFileNames_Item);

router.get("/getYear", GetYear);
router.get("/getProjectCreator/:year", GetProjectCreator);
router.get("/getProjectName/:year/:projectCreator", GetProjectName);
router.get("/getWorkOrder/:year/:projectCreator/:projectName", GetWorkOrder);
router.get("/getItem/:year/:projectCreator/:projectName/:workOrder", GetItem);

module.exports = router;
