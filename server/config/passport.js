import passport from 'passport';
import GithubStrategy from 'passport-github2'
import Admin from '../model/Admin/Admin.js';

passport.serializeUser((user, done) => {
  console.log("serializeUser ===> ", user)
  done(null, user);
}); 
  
passport.deserializeUser((req, user, done) => {
  console.log("deserializeUser ", user)
  done(null, user)
});

passport.use(
  new GithubStrategy(
    {
      clientID: 'b8137aa132bc06586295',
      clientSecret: '2503bd002b0621d07f41eaa104eedddd1fbc97bf',
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
      console.log("at ", accessToken)
      console.log("rt ", refreshToken)
      try {
        const existingAdmin = await Admin.findOne({ id: profile?.id });
        if (existingAdmin) {
          return done(null, existingAdmin);
        }else{
          const newAdmin = await Admin.create({
            // id: profile?.id,
            username: profile?.username,
            fullName: profile?.displayName || 'Admin',
            email: profile?.email,
            avatar: profile?._json.avatar_url,
          });
          console.log("serializeUser ", newAdmin);
          return done(null, newAdmin);
        }
      } catch (err) {
        done(err);
      }
      // done(null, profile);
    }
  )
);
