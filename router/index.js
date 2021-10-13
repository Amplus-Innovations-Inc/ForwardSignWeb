const { Router } = require("express");
const { authenticateUser } = require("../database/userHandler");
const { GetPDFFile } = require("../utils/ConvertHandler");
const {
  GetFileNames,
  GetWorkOrders,
  GetFile,
} = require("../utils/FileHandler");

const router = Router();

router.post("/login", authenticateUser);
router.get("/getFile/:foldername/:filename", GetFile);
router.get("/getPDFFile/:foldername/:filename", GetPDFFile);

router.get("/getFileNames/:foldername", GetFileNames);
router.get("/getWorkOrders", GetWorkOrders);

module.exports = router;
