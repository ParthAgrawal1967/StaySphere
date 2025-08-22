const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");
const hostController = require("../controllers/host");
const { validateHostInfo,isLoggedIn,isHostOwner } = require("../middleware.js");

// New Host form
router.get("/newhost",isLoggedIn, hostController.newHostForm);

// Create Host
router.post(
  "/",
   isLoggedIn,
  upload.single("host[image]"),
  validateHostInfo,
  wrapAsync(hostController.createHost)
);

// Edit Host Info
router.get("/:hostId/editHostInfo",isLoggedIn,isHostOwner,wrapAsync(hostController.editHostInfo));

// Update Host
router.put(
  "/:hostId", isLoggedIn,isHostOwner,
  upload.single("host[image]"),
  validateHostInfo,
  wrapAsync(hostController.updateHost)
);

module.exports = router;
