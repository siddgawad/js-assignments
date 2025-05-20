import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:true},
    adminId:{type:mongoose.Types.Schema.ObjectId},

},{timestamps:true});

adminSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

})

export const Admin = mongoose.model("Admin", adminSchema);



const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
  }, { timestamps: true });
  
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  export const User = mongoose.model("User", userSchema);
  
  const courseSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    imageUrl:    { type: String, required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "Admin" } // or User with role 'admin'
  }, { timestamps: true });
  
  export const Course = mongoose.model("Course", courseSchema);
  
  const purchaseSchema = new mongoose.Schema({
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    priceAtPurchase: { type: Number, required: true },
    purchasedAt:     { type: Date, default: Date.now }
  }, { timestamps: true });
  
  export const Purchase = mongoose.model("Purchase", purchaseSchema);
  
