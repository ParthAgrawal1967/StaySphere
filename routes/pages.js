const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");

router.get("/privacy", pagesController.renderPrivacy);
router.get("/terms", pagesController.renderTerms);

module.exports = router;
