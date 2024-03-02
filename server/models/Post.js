import mongoose from "mongoose";

const infoSchema = mongoose.Schema(
  {
    infoId: {
      type:Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
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
