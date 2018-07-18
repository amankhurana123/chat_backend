import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  password: { type: String }
});
export default mongoose.model("userSchema", userSchema);
