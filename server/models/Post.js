import mongoose from "mongoose";

const infoSchema = mongoose.Schema(
  {
    infoId: {
      type:String,
      required: true,
      unique: true,
    }, name: {
      type: String,
      required: true,
    },
    
    about: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      max: 10,
    },
    registrations: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
  
);

const Info = mongoose.model("Info", infoSchema);

export default Info;
