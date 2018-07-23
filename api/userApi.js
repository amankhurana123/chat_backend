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
  }
};
