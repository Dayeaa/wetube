import routes from "../routes";
import User from "../models/User";
import passport from "passport";

//회원가입
export const getJoin = (req,res) => {
    res.render("join", {pageTitle : "JOIN"})

}
export const postJoin = async(req,res,next) => {
    const {
        body : {name,email,password,password2}
    } = req;
    if(password != password2){
        res.status(400);
    }
    else{
        //To Do: 유저등록
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user,password);
            next();
            //To Do: 로그인
              
        } catch (error) {
         console.log(error);
         res.redirect(routes.home);  
        }
        
    }
    

}

//로그인

export const githubLoginCallback = (accessToken, refreshToken, profile, done) =>
{
    console.log(accessToken, refreshToken, profile, done);
}

export const getLogin = (req,res) => res.render("login", {pageTitle : "LOGIN"});
export const postLogin = passport.authenticate("local",{
    failureRedirect : routes.login,
    successRedirect : routes.home
});

//로그아웃
export const logout = (req,res) => {
    //to do: process logout
    req.logout();
    res.redirect(routes.home);
}
export const users = (req,res) => res.render("users", {pageTitle : "USERS"});
export const userDetail = (req,res) => res.render("userDetail", {pageTitle : "USER DETAIL"});
export const editProfile = (req,res) => res.render("editProfile", {pageTitle : "프로필 수정"});
export const changePassword = (req,res) => res.render("changePassword", {pageTitle : "비밀번호 변경"});
