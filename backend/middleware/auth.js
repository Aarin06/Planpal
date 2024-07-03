import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "../models/users.js";

const GOOGLE_CLIENT_ID =
  "407535876944-gj5djdpeqo89vb51hkgjffdlml5td9eu.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";


passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent'
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log("fjdklsajf");
      console.log(accessToken);
      console.log("g",refreshToken);  // Ensure this is logging correctly
      console.log(profile);
      console.log(done);

      try {
        // Find the user by their Google ID
        const user = await User.findOne({ where: { googleId: profile.id } });
    
        if (user) {
          // If user exists, update their accessToken
          await user.update({ accessToken: accessToken });
          console.log("already exists");
        } else {
          // If user does not exist, create a new user with the provided details
          const newUser = await User.create({
            username: profile.displayName,
            googleId: profile.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
          });
          return done(null, newUser);
        }
    
        // Return the updated or newly created user
        return done(null, user);
      } catch (error) {
        // Handle any errors
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("logged in");
  console.log(user.id);
  done(null, user.id);
});

passport.deserializeUser(function (userId, done) {
  console.log("the session contains: ", userId);
  User.findByPk(userId, function(err, user) {
    if (err) { return done(err); }
    console.log("the user is {}", user);
    done(null, user); // The user object is attached to the request as req.user
  });
});
