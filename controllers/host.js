const Host = require("../models/host");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.newHostForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    const existingHost = await Host.findOne({ user: req.user._id });
    if (existingHost) {
        listing.host = existingHost._id;
        await listing.save();
        if (!existingHost.listings.includes(listing._id)) {
            existingHost.listings.push(listing._id);
            await existingHost.save();
        }
        req.flash("success", "Using your existing host profile for this listing.");
        return res.redirect(`/listings/${listing._id}`);
    }
    res.render("hosts/newhost", { listing });
};

module.exports.createHost = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let host = await Host.findOne({ user: req.user._id });

    if (!host) {
        // Prepare host data
        let hostData = req.body.host || {};
        if (hostData.hobbies) hostData.hobbies = hostData.hobbies.split(",").map(h => h.trim());
        if (hostData.favoritePlaces) hostData.favoritePlaces = hostData.favoritePlaces.split(",").map(p => p.trim());
        if (req.file) {
            hostData.image = { url: req.file.path, filename: req.file.filename };
        }

        host = new Host({
            ...hostData,
            user: req.user._id,
            listings: [listing._id]
        });
        await host.save();
    } else {
        // Existing host
        if (!host.listings.includes(listing._id)) host.listings.push(listing._id);
        await host.save();
    }

    // Link listing to host and mark active
    listing.host = host._id;
    listing.isActive = true;  // optional
    await listing.save();

    req.flash("success", "Host info added and listing is now active!");
    res.redirect(`/listings/${listing._id}`);
};



module.exports.editHostInfo = async (req, res) => {
  const { id, hostId } = req.params;
  const listing = id ? await Listing.findById(id) : null;
  const host = await Host.findById(hostId);

  if (!host || (id && !listing)) {
    req.flash("error", "Host or Listing not found");
    return res.redirect(id ? `/listings/${id}` : "/hosts");
  }

  const originalPhotoUrl = host.image?.url || null;

  res.render("hosts/editHostInfo", { listing, host, originalPhotoUrl });
};




module.exports.updateHost = async (req, res) => {
    if (!req.body.host) {
    throw new ExpressError(400, "Send valid data");
  }
  const { id, hostId } = req.params;
  const host = await Host.findByIdAndUpdate(hostId, { ...req.body.host }, { new: true });

  if (req.file) {
    host.image = { url: req.file.path, filename: req.file.filename };
    await host.save();
  }

  req.flash("success", "Host information updated!");
  res.redirect(`/listings/${id}`);
};
