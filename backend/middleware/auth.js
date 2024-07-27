import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "../models/users.js";

dotenv.config({ path: "../.env" });

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
    },
    async function (request, accessToken, refreshToken, profile, done) {
      // create a user in the database
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      console.log("fjdklsajf");
      console.log(accessToken);
      console.log(refreshToken); // Ensure this is logging correctly
      try {
        // Find the user by their Google ID
        const user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          // If user exists, update their accessToken
          await user.update({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
          // If user does not exist, create a new user with the provided details
          const newUser = await User.create({
            username: profile.displayName,
            googleId: profile.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile._json,
            tier: 1,
          });
          return done(null, newUser);
        }

        // Return the updated or newly created user
        return done(null, user);
      } catch (error) {
        // Handle any errors
        return done(error);
      }
    },
  ),
);

//In these snippets, the serializeUser and deserializeUser methods are simplified to just pass the user object through without any transformation or database lookup, which might not be practical for most applications. Typically, you would serialize a user identifier (like a user ID) to the session, and during deserialization, you would use that identifier to fetch the user details from a database.
passport.serializeUser(function (user, done) {
  console.log("User logged in:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async function (userId, done) {
  try {
    console.log("Deserializing user with ID:", userId);
    const user = await User.findByPk(userId);
    if (!user) {
      return done(new Error("User not found"));
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});
