var middlewareObj = {};
var User         =  require("../models/user");


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login");
}

middlewareObj.checkOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err){
                console.log(err);
                res.redirect("back");
               
            } else{
                if(foundUser.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back")
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

module.exports = middlewareObj;