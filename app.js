const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

//Port connection
const port=3000;

app.listen(port,()=>{
    console.log("3000 Port connected");
})

//database connection
const MONGO_URL="mongodb://127.0.0.1:27017/StaySphere"

main().then(()=>{
    console.log("Database connected");
})
.catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

//root route
app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});

//index route
app.get("/listings",async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

//create route
app.post("/listings",async (req,res)=>{
   let newListing=new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async (req,res)=>{
   let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listing/:id", async (req,res)=>{
  let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
});

//listing route
// app.get("/testListing",async (req,res)=>{
// let sampleListing=new Listing({
//     title:"My Home",
//     description:"A beautifull home near beachside",
//     price:1200,
//     location:"Lucknow, Uttar Pradesh",
//     country:"India",
// });
//   await sampleListing.save();
//   console.log("sample saved");
//   res.send("sucessfull");
// });