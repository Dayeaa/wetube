import routes from "../routes";
import Video from "../models/Video";

//////////////////////비디오홈
export const home = async(req,res) => {//async는 이 function의 어떤 부분은 꼭 기다려!라는 의미
    try {
        const videos = await Video.find({}).sort({_id: -1}); //sync가 있어야 await 가능
        //throw Error('lalala');
        res.render("home" , {pageTitle : "HOME", videos});//home에 videos 전달
            
    } catch (error) {
        console.log(error);
        res.render("home",{pageTitle:"HOME", videos:[]});   
        } 
}

///////////////////////비디오검색
export const search = async(req,res) => {
    const {
        query : {term : Searchingby}
    }= req;

    let videos = [];
    try {
        videos = await Video.find({
            title : {$regex : Searchingby, $options : "i"} //$regex: Searchingby포함, $options : "i"->대소문자구분x
        });
    } catch (error) {
        console.log(error)
    }
    res.render("search",{pageTitle:"SEARCH",Searchingby,videos});
};

///////////////////////비디오업로드
export const getUpload = (req,res) => res.render("upload", {pageTitle : "UPLOAD"});
export const postUpload = async(req,res) => {
    //to do: upload and save video
    const {        
        body:{ title, description},
        file : {path}
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description
    });
    res.redirect(routes.videoDetail(newVideo.id));
    
}

///////////////////////비디오상세
export const videoDetail = async(req,res) => {
    const {
        params : {id}
    } = req; 
    try {
        const video = await Video.findById(id);
        res.render("videoDetail", {pageTitle :`${video.title}`, video});    
    } catch (error) {
        res.redirect(routes.home);
    }
}

///////////////////////비디오수정
export const getEditVideo = async(req,res) =>{
    const {
        params : {id}
    } = req;
    try {
        const video = await Video.findById(id);
        res.render("editVideo",{pageTitle: `EDIT ${video.title}`, video});
    } catch (error) {
        res.redirect(routes.home);
    }
 }  
export const postEditVideo = async(req,res) =>{
   const {
       params : {id},
       body : { title, description}
   } = req;

   try {
       await Video.findOneAndUpdate({_id: id},{title, description});
       res.redirect(routes.videoDetail(video.id));
   } catch (error) {
       res.redirect(routes.home);
   }
} 

///////////////////////비디오삭제
export const deleteVideo = async(req,res) => {
    const {
        params : {id}
    } = req;

    try {
        await Video.findOneAndRemove({_id: id});
    } catch (error) {
        
    }
    res.redirect(routes.home);
}