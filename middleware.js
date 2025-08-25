const Listing=require("./models/listing");
const Review=require("./models/review");
const Host = require("./models/host");

const ExpressError=require("./utils/ExpressError.js");
const { listingSchema,reviewSchema,hostInfoSchema }=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id))
   {
    req.flash("error","You are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
   }
   next();
};

//listing server validate
module.exports.validateListing=(req,res,next)=>{
 let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
 let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
 let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id))
   {
    req.flash("error","You are not the author of the review");
    return res.redirect(`/listings/${id}`);
   }
   next();
};

//validate hostInfo
module.exports.validateHostInfo=(req,res,next)=>{
 let {error}=hostInfoSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isHostOwner = async (req, res, next) => {
  const { hostId, id } = req.params;
  const host = await Host.findById(hostId);

  if (!host) {
    req.flash("error", "Host not found!");
    return res.redirect(id ? `/listings/${id}` : "/listings");
  }

  if (!req.user || !host.user.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(id ? `/listings/${id}` : "/listings");
  }

  next();
};

module.exports.setLocals = (req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.showTax = req.session.showTax || false;

  next();
};
