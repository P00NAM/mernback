require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const multer = require("multer");
require("./db/conn");
const Registration = require("./models/dataa");
const bcryptjs = require("bcryptjs");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
  const {v4: uuidv4} = require("uuid");
const {setUser} = require('../service/auth');
const {createToken, validateToken} = require('../service/authentication');
const {restrictToLoggedinUserOnly} = require('../middlewares/auth');

const SECRET_KEY= "NOTESAPI"

const path = require("path"); 
const hbs = require("hbs");
const exp = require("constants");
const { Collection } = require("mongoose");
const port= process.env.PORT || 3000;

//connect with html

const static_path =path.join(__dirname, '../public');
const template_path= path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname,"../templates/partials");

// console.log(path.join(__dirname, "../public")); till public gic dir

app.use(express.json());
app.use(cookieParser());
//app.use("/url",  urlRoute);
//app.use("/user", userRoute);
//app.use("/", staticRoute);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path); // for tell ki views not on it's place
hbs.registerPartials(partial_path);
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")) );
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")) );
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")) );

// for uploading files 
/*const upload =multer({
    storage: multer.diskStorage({
        Destination: function(req, file, cb){
            cb(null, "uploads")
        },
        filename: function(req, file, cb){
            cb(null, file.filedname  + "_" + Date.now() + ".JPG")
        }
    })
}).single("user_photo"); */

app.get("/" , (req,res)=>{
    res.render("index");
});

app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", async(req,res) =>{
    try{
         const password = req.body.password;
         const confirmpassword = req.body.confirmpassword;

         if(password=== confirmpassword){

            const hashpassword = await bcryptjs.hash(password, 10); 
            console.log("secret key m prblm h ");
            const token = jwt.sign({email :this.email, id: this._id}, process.env.SECRET_KEY);

            const regemp = new Registration({
    
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                password : hashpassword,
                confirmpassword: confirmpassword,
                token: token
            });
        
           
           
            console.log("the token is "+ token);

            /*res.cookie("jwt", token, {
                expires:new Date(Date.now()+30000),
                httpOnly: true
            });
            console.log(cookie);*/

            await Registration.insertMany([regemp]);
           // const registered = await regemp.save();
            console.log(regemp);
            return res.redirect("/");

         }
         else {
            res.render("password is not matching");
         }

    }catch(error) { res.status(400).send(error); 
    console.log("error of post register" + error);  }
    
 })

 app.get("/login", (req, res)=>{
    res.render("login");
})

app.post("/login", async (req, res)=> {
    try{
        const {email, password} = req.body;

        const user = await Registration.findOne({ email });
        
        console.log(user);
        if(!user){
            return res.status(404).render({message: "failed "});
        }
        
       
        /*res.cookie("jwt", token, {
            expires:new Date(Date.now()+ 50000),
            httpOnly:true
        });*/
        
        const isMatch = await bcryptjs.compare(password, user.password);
        console.log(password);
        if(!isMatch){
             res.send("wrong password");
        }

       /* const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("uid", sessionId); */

        const token = createToken(user);
       // res.cookie("uid", token);

        return res.json({ token});
        
    }catch(e){
        res.status(400).send("User not found ");
        console.log(e);
    }
})


app.listen(port, () => {
    console.log(`server is running at ${port}`);
})