const mongoose= require("mongoose");
const validator= require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//schema 
const registerSchema= new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true,
        unique: true,
        minlength: 3 
    },
    email:{
        type: String,
        required: true,
        unique:[true, "Email is already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }

    },
    password:{
        type: String,
        required: true,
        minlength: 5
    },
    confirmpassword:{
        type: String,
        required: true,
        minlength: 5
    },
    phone: {
        type:Number,
        min:10,
        
        required:true
    },
    address:{
        type:String
    },
    
        token:{
            type: String,
            required: true
        }
    
})
/*for generate tokens
registerSchema.methods.generateAutoToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id: this._id.toString()}, "mynameispoonamsinghfrometawahpursuingbtech" );
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(e){
        res.send(" the erroe" + e);
        console.log(e);
    }
}
/*hashing

 registerSchema.pre("save", async function(next){
    if(this.isModified("password")){
    const passwordhash = await bcryptjs.hash(password, 10);
    console.log(`current pass: $(this.password)`);
    console.log(passwordhash);
    }
    next();
})
*/
//create new collection..
const Registration = new mongoose.model('Student', registerSchema);
//student here is singular S of Student capital it work as a class

// export
module.exports = Registration ;

