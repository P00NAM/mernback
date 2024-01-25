const router = express.Router();
 
router.post("/register", async(req,res) =>{
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


router.post("/login", async (req, res)=> {
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

 module.exports = router;