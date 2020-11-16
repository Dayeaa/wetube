import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/"});
const multerAvatar = multer({dest: "uploads/avatars/"})
export const localMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    next();
};

export const onlyPublic = (req, res, next) =>{
    if(req.user){
        res.redirect(routes.home);
    }else{
        next();
    }
}

export const onlyPrivate = (req, res, next) =>{
    if(req.user){
        next();
    }else{
        res.redirect(routes.home);
    }
}

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single("avatar");
//single은g 오직 하나의 파일만 upload 할 수 있음을 의미
//upload.pug에서의 name=videoFile
