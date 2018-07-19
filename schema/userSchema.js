import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  username: { type: String }
});
module.exports = mongoose.model("userSchema", userSchema);
