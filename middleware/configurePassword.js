import passportLocal from "passport-local";
import userSchema from "../schema/userSchema";

let LocalStrategy = passportLocal.Strategy;

const messages = {
  emailAlreadyExists: "That email is already exists.",
  proceedToSignup: "authorised to create user.",
  userNotFound: "No user found.",
  wrongPassword: "Oops! Wrong password.",
  userNotVerified: "User is not verified",
  notActive: "This account is not active",
  notAdmin: "Only Admin can Login"
};

export default function(passport) {
  // passport session setup
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
  /*LOCAL LOGIN
   * we are using named strategies since we have one for login and one for register
   * by default, if there was no name, it would just be called 'local'
  */
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        // find a user whose email is the same as the forms email
        userSchema
          .findOne({ email: email })
          .then(user => {
            // if no user is found, return the message
            if (!user) {
              return done(null, false, {
                message: messages.userNotFound,
                userError: true
              });
            }
            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
              return done(null, false, {
                message: messages.wrongPassword,
                passwordError: true
              });
            }
            // user is not verified
            if (!user.verificationStatus) {
              return done(null, false, {
                message: messages.userNotVerified,
                userError: true
              });
            }

            return done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      }
    )
  );
}
