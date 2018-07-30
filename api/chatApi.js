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
  chatMessage: (fromUser, toUser, option) => {
    return new Promise((resolve, reject) => {
      chatSchema
        .find({
          $or: [{ fromUser, toUser }, { fromUser: toUser, toUser: fromUser }]
        })
        .populate(["fromUser", "toUser"])
        .sort(option.sort)
        .limit(option.limit)
        .skip(option.skip)
        .then(result => {
          resolve(result);
        });
    });
  },
  chatMessageData: data => {
    return new Promise((resolve, reject) => {
      chatSchema
        .find(data)
        .populate(["fromUser", "toUser"])
        .sort({ _id: -1 })
        .then(result => {
          resolve(result);
        });
    });
  }
};
