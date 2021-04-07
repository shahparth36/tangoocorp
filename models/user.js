var mongoose=require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema =new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password:String,
    firstName: String,
    lastName: String,
    fullName:String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    phNumber: {type: String, required: true },
    image: String,
    imageId: String,
    dob: String,
    city: String,
    gender: String,
    maritalStatus: String,
    relType: String,
    sexuality:String,
    liveIn: String, 
    smoke:String,
    alcohol:String,
    age:Number,
    bio:String,
    relInitialAge:Number,
    relFinalAge:Number,
    images: [{ url: String, public_id: String }],
    insta_url:String,
    facebook_url:String,
    twitter_url:String,
    savedUser:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    likedUser:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    likedBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    temp: [
        String
    ],
    createdAt: { type: Date, default: Date.now }
});

UserSchema.plugin(passportLocalMongoose, {
    usernameQueryFields: ["phNumber","email"]
});


module.exports=mongoose.model("User",UserSchema) 