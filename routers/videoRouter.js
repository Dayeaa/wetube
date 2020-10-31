import express from "express";
import routes from "../routes";
import { videos } from "../db";
import { getUpload, postUpload, videoDetail, deleteVideo, getEditVideo, postEditVideo } from "../controllers/videoController";
import { onlyPrivate, uploadVideo } from "../middlewares";

const videoRouter = express.Router();

//비디오업로드
videoRouter.get(routes.upload,onlyPrivate,getUpload);
videoRouter.post(routes.upload,onlyPrivate,uploadVideo,postUpload);

//비디오상세
videoRouter.get(routes.videoDetail(),videoDetail);

//비디오수정
videoRouter.get(routes.editVideo(),onlyPrivate,getEditVideo);
videoRouter.post(routes.editVideo(),onlyPrivate,postEditVideo);


//비디오삭제
videoRouter.get(routes.deleteVideo(),onlyPrivate,deleteVideo);

export default videoRouter;