import chatSchema from "../schema/chatSchema";

module.exports = {
  chatData: data => {
    return new Promise((resolve, reject) => {
      chatSchema.create(data, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  },
  chatMessage: data => {
    return new Promise((resolve, reject) => {
      chatSchema
        .find({ $or: [{ formUser: data }, { toUser: data }] })
        .populate(["formUser", "toUser"])
        .sort({ _id: 1 })
        .then(result => {
          resolve(result);
        });
    });
  },
  chatMessageData: data => {
    return new Promise((resolve, reject) => {
      chatSchema
        .find(data)
        .populate(["formUser", "toUser"])
        .sort({ _id: -1 })
        .then(result => {
          resolve(result);
        });
    });
  }
};
