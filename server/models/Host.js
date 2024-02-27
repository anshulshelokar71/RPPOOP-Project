import mongoose from "mongoose";

const HostSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true,'Please add a name'],
      min: 2,
      max: 50,
    },
    
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    
  },
  { timestamps: true }
);

const Host = mongoose.model("Host", HostSchema);
export default Host;
