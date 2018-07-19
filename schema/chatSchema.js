import mongoose from "mongoose";
const chatSchema = mongoose.Schema({
  formUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    require: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    require: true
  },
  message: { type: String }
});
module.exports = mongoose.model("chatSchema", chatSchema);
