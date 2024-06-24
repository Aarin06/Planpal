import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

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
    function (request, accessToken, refreshToken, profile, done) {
      // create a user in the database
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      return done(null, profile);
    }
  )
);

//In these snippets, the serializeUser and deserializeUser methods are simplified to just pass the user object through without any transformation or database lookup, which might not be practical for most applications. Typically, you would serialize a user identifier (like a user ID) to the session, and during deserialization, you would use that identifier to fetch the user details from a database.
passport.serializeUser(function (user, done) {
  console.log("logged in");
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
