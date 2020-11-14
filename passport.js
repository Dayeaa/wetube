import passport from "passport";
import routes from "./routes";
import GithubStrategy from "passport-github";
import { githubLoginCallback } from "./controllers/userController.js";
import User from "./models/User.js";
import request from "request";
import undefsafe from "undefsafe";


passport.use(User.createStrategy());

passport.use(new GithubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: `http://localhost:4000${routes.githubcallback}`,
    scope: "user:email"
},githubLoginCallback));

passport.serializeUser(User.serializeUser());//쿠키에는 오직 user.id만 담아서 보내라
passport.deserializeUser(User.deserializeUser());