const { createToken, validateToken } = require("../service/authentication");

async function restrictToLoggedinUserOnly(req, res, next){
    const userUid = req.headers["Authorization "];
    console.log(req.headers);
    if(!userUid) return res.redirect("/login");
    const token = userUid.split("Bearer")[1];
    const user = validateToken(token);

    if(!user) return res.redirect("/login");

    res.user = user;
    next();
}
async function checkAuth(req, res, next){
    const userUid= req.header["Authorization"];
     const token = userUid.split("Bearer")[1];

     const user= createToken(token);

     req.user = user;
     next();
}
module.export = {restrictToLoggedinUserOnly, checkAuth};