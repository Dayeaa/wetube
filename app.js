import "core-js";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { localMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";


import "./passport";
const app = express();
const cookieStore = MongoStore(session);

app.use(helmet());
app.set("view engine","pug");
app.use("/uploads", express.static("uploads"));//directory에서 file을 보내주는 mw
app.use("/static",express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));

console.log(process.env.COOKIE_SECRET);


app.use(
    session({
        secret : process.env.COOKIE_SECRET,
        resave : true,
        saveUninitialized : false,
        store : new cookieStore({mongooseConnection : mongoose.connection})
}));

app.use(passport.initialize());//초기화 한 후, 쿠키를 받아 해당하는 사용자의 정보를 찾고
app.use(passport.session());// passport는 찾은 정보를 사용자의 요청에 따라 req.user로 만들어줌  localMiddleware = (req <--에))

app.use(localMiddleware);

app.use(routes.home,globalRouter);
app.use(routes.users, userRouter); //use--> 누군가 /user로 접속했을 때 내가 userRouter 전체를 사용하겠다는 의미
app.use(routes.videos,videoRouter);

export default app;