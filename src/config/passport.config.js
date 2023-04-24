import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import Users from "../dao/dbManagers/users.js";
import { PRIVATE_KEY } from "../utils.js";

const userManager = new Users();

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          if (!jwt_payload.user)
            return done(null, false, { messages: "Invalid credentials!" });

          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.d6a7c44f537782ef",
        clientSecret: "3b638abf00ff4451af1317f5f63d45ca7933fb60",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userManager.findByEmail(profile._json.email);
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: "",
              cart: "",
              password: "",
            };

            const result = await userManager.add(newUser);

            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userManager.findById(id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

export default initializePassport;
