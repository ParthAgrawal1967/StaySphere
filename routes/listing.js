const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing");

router.route("/")
//index route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)
);

//new route
router.get("/new",isLoggedIn,listingController.newListing);

router.get("/search", listingController.searchListings);

router.get("/category/:category", wrapAsync(listingController.getListingsByCategory));

router.route("/:id")
//show route
.get(wrapAsync(listingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
//Delete route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


module.exports=router;