import userSchema from "../schema/userSchema";

module.exports = {
  getUsername: data => {
    return new Promise((resolve, reject) => {
      userSchema
        .findOne({ email: data })
        .then(result => resolve(result))
        .catch(error => {
          reject();
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
console.log("data", data)
    return new Promise((resolve, reject) => {
      userSchema
        .create(data)
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject();
        });
    });
  },
  getUserVerification: data => {
    return new Promise((resolve, result) => {
      userSchema
        .findOne(data)
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject();
        });
    });
  },
  getUser: data => {
    return new Promise((resolve, reject) => {
      userSchema
        .find({ _id: { $ne: data } })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject();
        });
    });
  }
};
