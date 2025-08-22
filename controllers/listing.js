const Listing=require("../models/listing");
const Host = require("../models/host");

module.exports.index=async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};

module.exports.newListing=(req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res,next)=>{
   let url=req.file.path;
   let filename=req.file.filename;
   const newListing=new Listing(req.body.listing);
   newListing.owner=req.user._id;
   newListing.image={url,filename};
           const apiKey = process.env.OPENWEATHER_KEY;
        const location = newListing.location;

        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
        const geoRes = await fetch(geoUrl);
        const data = await geoRes.json();
        
        let coords = null;
         if (data.length > 0) {
        coords = {
            type: "Point",
            coordinates: [data[0].lon, data[0].lat]
        };
    }
   newListing.geometry=coords;
  let savedListing= await newListing.save();
   req.flash("success", "New Listing Created! Please add host info.");
   res.redirect(`/listings/${savedListing._id}/hostinfo/newhost`);
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
       populate: { path: "author" }
    },).populate("owner") .populate("host");;
    if(!listing)
    {
        req.flash("error","Listing does not exits!");
        return res.redirect("/listings");
    }
     const host = listing.host;
    res.render("listings/show.ejs",{listing,host});
}

module.exports.editListing=async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing)
    {
        req.flash("error","Listing does not exits!");
       return res.redirect("/listings");
    }
     let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250,h_250");
   res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
     if(!req.body.listing)
    {
        throw new ExpressError(400,"send valid data");
    }
   let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!=="undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
   }
   req.flash("success","Listing Updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
  let {id}=req.params;
  await Listing.findOneAndDelete({ _id: id }).populate("reviews");

const deletedListing = await Listing.findByIdAndDelete(id);
if (deletedListing && deletedListing.host) {
  await Host.findByIdAndUpdate(deletedListing.host, { $pull: { listings: deletedListing._id } });
  const host = await Host.findById(deletedListing.host);
  if (host && host.listings.length === 0) {
    await Host.findByIdAndDelete(host._id);
  }
}

  req.flash("success","Listing Deleted!");
   res.redirect("/listings");
}