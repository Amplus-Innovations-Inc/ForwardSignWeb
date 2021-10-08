const { Router } = require("express");
const { authenticateUser } = require("../database/userHandler");

const router = Router();

router.post("/login", authenticateUser);

module.exports = router;
