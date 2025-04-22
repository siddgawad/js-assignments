import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true, match: [/.+@.+\..+/, "Invalid email format"]}, password:{type:String,required:true, validate: {
        validator: function (val) {
          return passwordRegex.test(val);
        },
        message:
          "Password must contain 1 uppercase, 1 number, 1 special character and be at least 8 characters long",
      },}
});

userSchema.pre("save",async function (next){
    if (!this.isModified("password"))return next();
    try{
        this.password = await bcrypt.hash(this.password,10);
    next();

    } catch(err){
        next(err);
    }
    
});

userSchema.methods.comparePassword = async function (candidatePassword){
    return bcrypt.compare(candidatePassword,this.password);
}

const User = mongoose.model("user",userSchema);
export default User;
