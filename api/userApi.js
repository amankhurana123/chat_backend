import userSchema from "../schema/userSchema";

module.exports = {
  getUsername: data => {
    return new Promise((resolve, reject) => {
      userSchema.findOne({ username: data }, (error, result) => {
        if (!result) {
          resolve(error);
        } else {
          resolve(result);
        }
      });
    });
  },

  getUsernameNew: data => {
    userSchema.findOne({ username: data }).then(user => {
      console.log("user-->>", user);
      return user;
    });
  },

  createUser: data => {
    return new Promise((resolve, reject) => {
      userSchema.create(data, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject();
        }
      });
    });
  }
};
