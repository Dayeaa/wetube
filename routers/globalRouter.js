import express from "express";
import routes from "../routes";
import passport from "passport"
import { home, search } from "../controllers/videoController";
import { logout, getJoin, postJoin, getLogin, postLogin, githubLogin, postGithubLogIn, getMe} from "../controllers/userController";
import { onlyPublic } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join,onlyPublic,getJoin);
globalRouter.post(routes.join,onlyPublic,postJoin,postLogin);

globalRouter.get(routes.login,onlyPublic,getLogin);
globalRouter.post(routes.login,onlyPublic,postLogin);

globalRouter.get(routes.home,home);
globalRouter.get(routes.search,search);

globalRouter.get(routes.logout,logout);

globalRouter.get(routes.github,githubLogin);
globalRouter.get(
    routes.githubcallback,
    passport.authenticate('github', { failureRedirect: '/login' }),
    postGithubLogIn
);

globalRouter.get(routes.me,getMe);


export default globalRouter;

//독점적으로 url을 다루는 방법