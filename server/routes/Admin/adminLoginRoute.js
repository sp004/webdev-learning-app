import express from 'express';
import passport from 'passport';
// import '../../config/passport.js'
// import passport from '../../config/passport.js';
const adminLoginRouter = express.Router()

adminLoginRouter.get("/login/success", (req, res) => {
    console.log("req.user ===", req.user)
    if (req.user) {
		res.status(200).json({status: 'Success', message: "Successfully Loged In", user: req.user});
	} else {
		res.status(401).json({ message: "Not Authorized" });
	}
})

adminLoginRouter.get("/login/failed", (req, res) => {
    res.status(401).json({message: 'Login Failed'})
})

adminLoginRouter.get("/github",
    passport.authenticate("github", {
        scope: ["profile"],
    })
);

adminLoginRouter.get("/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/login/failed",
        successRedirect: "http://localhost:3000/admin/dashboard"
    }),
);
  
adminLoginRouter.get("/logout", (req, res, next) => {
    req.logout()
    // req.session.destroy()
    // res.redirect("http://localhost:3000/admin")
    // req.logout(function(err) {
    //     if(err) return next(err); 
    //     // req.session.destroy()
    //     console.log("hello logout")
    //     res.redirect("http://localhost:3000/admin")
    // }); // This will clear the session and remove the authenticated user
    // req.session.destroy((err) => {
    //     if (err) {
    //       console.log(err);
    //     }
        // res.redirect("/admin/login"); // Redirect to the login page after logout
    // });
});

export default adminLoginRouter