const Listing = require("../models/listing");
const Host = require("../models/host");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
    // Only fetch active listings
    const allListings = await Listing.find({ isActive: true });
    res.render("listings/index.ejs", { allListings, showTax: req.session.showTax || false });
};

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    try {
        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            image: req.file ? { url: req.file.path, filename: req.file.filename } : undefined,
            isActive: false // listing pending until host info is added
        });

        const location = newListing.location;
        if (location) {
            const apiKey = process.env.OPENWEATHER_KEY;
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
            const geoRes = await fetch(geoUrl);
            const data = await geoRes.json();
            if (data.length > 0) {
                newListing.geometry = { type: "Point", coordinates: [data[0].lon, data[0].lat] };
            }
        }

        const savedListing = await newListing.save();
        req.flash("success", "Please add host info. to save listing");
        res.redirect(`/listings/${savedListing._id}/hostinfo/newhost`);
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Could not create listing!");
        res.redirect("/listings/new");
    }
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findOne({ _id: id, isActive: true }) // Only show active listings
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner")
        .populate("host");

    if (!listing) {
        req.flash("error", "Listing does not exist or is not active!");
        return res.redirect("/listings");
    }

    const host = listing.host;
    res.render("listings/show.ejs", { listing, host });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image?.url;
    if (originalImageUrl) originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) throw new ExpressError(400, "Send valid data");

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing && deletedListing.host) {
        await Host.findByIdAndUpdate(deletedListing.host, { $pull: { listings: deletedListing._id } });
        const host = await Host.findById(deletedListing.host);
        if (host && host.listings.length === 0) {
            await Host.findByIdAndDelete(host._id);
        }
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.getListingsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        // Only active listings in the category
        const listings = await Listing.find({ category, isActive: true });

        if (!listings.length) {
            return next(new ExpressError(404, "No Listings available for this category"));
        }

        res.render("listings/category", { listings, category, showTax: req.session.showTax || false });
    } catch (err) {
        console.error("Error fetching listings by category:", err);
        next(new ExpressError(500, "Server Error"));
    }
};


module.exports.searchListings = async (req, res) => {
  try {
    const query = req.query.q || "";

    const filter = query
      ? {
          isActive: true,
          $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
          ]
        }
      : { isActive: true };

    const listings = await Listing.find(filter);

    res.render("listings/index", { allListings: listings, query });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send("Server Error");
  }
};