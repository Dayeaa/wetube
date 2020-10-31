import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User.js";

passport.use(User.createStrategy());
passport.use(new GithubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: "http://localhost/auth/github/callback"
}))

passport.serializeUser(User.serializeUser());//쿠키에는 오직 user.id만 담아서 보내라
passport.deserializeUser(User.deserializeUser());