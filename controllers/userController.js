import routes from "../routes";
import User from "../models/User";
import passport from "passport";
import request from "request";
import undefsafe from "undefsafe";

//회원가입
export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "JOIN" })

}
export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password != password2) {
        res.status(400);
    }
    else {
        //To Do: 유저등록
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next();
            //To Do: 로그인

        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }

    }


}

//로그인

//github
export const githubLogin = passport.authenticate("github");
    
export const githubLoginCallback = async (accessToken, _, profile, cb) => {
    const {
        _json: { id, avatar_url, name },
    } = profile;

    const email = undefsafe(profile, "emails.0.value");
    let promise = null;

    if (email) {
        promise = Promise.resolve(email);
    } else {
        promise = new Promise((resolve, reject) => {
            request(
                {
                    url: "https://api.github.com/user/emails",
                    json: true,
                    headers: {
                        "user-agent": "my user-agent",
                        authorization: `token ${accessToken}`,
                    },
                },
                (error, res, body) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(body.find((entry) => entry.primary).email);
                }
            );
        });
    }

    promise.then(async (email) => {
        try {
            const user = await User.findOne({ email });

            if (user) {
                user.githubId = id;
                user.save();
                return cb(null, user);
            } else {
                const newUser = await User.create({
                    email,
                    name,
                    githbId: id,
                    avatarUrl: avatar_url,
                });
                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    });
};
export const postGithubLogIn = (req, res) => {
    res.redirect(routes.home);
}
export const getLogin = (req, res) => res.render("login", { pageTitle: "LOGIN" });
export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

//로그아웃
export const logout = (req, res) => {
    //to do: process logout
    req.logout();
    res.redirect(routes.home);
}


//User관련
export const getMe = (req,res) =>
    res.render("userDetail", { pageTitle: "USER DETAIL", user : req.user});

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};

    export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const postEditProfile = async(req,res) => {
    const{
        body : {name,email},
        file
    } = req;
    try {
        console.log("userid "+ req.user.id);
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl : file? file.path : req.user.avatarUrl
        });
        res.redirect(routes.me);
    } catch (error) {
        res.render("editProfile",{pageTitle : "Edit Profile"})
    }
}
export const getChangePassword = (req, res) =>
    res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async(req, res) =>{
    const {
        body: {
            oldPassword,
            newPassword,
            newPassword1
        }
    }=req;
    
    try {
        if (newpassword !== newpassword1) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        const user = await User.findById(req.user._id);
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
}
