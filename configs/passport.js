const User = require('../models/User');
const Column = require('../models/Column');
const Ticket = require('../models/Ticket');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');

const getWeek = () => {
  let d = new Date();
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo
};

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: 'Incorrect username.' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: 'Incorrect password.' });
        return;
      }

      next(null, foundUser);
    });
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'https://irontickets.herokuapp.com/api/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      User.findOne({ githubId: profile.id })
        .then(found => {
          if (found !== null) {
            done(null, found);
          } else {
            return User.create({
              githubId: profile.id,
              username: profile.username,
              location: profile._json.location,
              image: profile._json.avatar_url,
              name: profile.displayName,
              bio: profile._json.bio,
              role: 'Student',
              cohortStartWeek: getWeek()
            }).then(dbUser => {
              Ticket.find({ status: 'Opened' }).then(tickets => {
                let openTickets = [];
                if(dbUser.role === 'Teacher') openTickets = tickets.map(ticket => ticket._id);
                Column.create({ user: dbUser._id, role: dbUser.role, columnOpen: openTickets }).then(column => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ message: 'Error while creating the board' });
                  }
                })
              })
              done(null, dbUser);
            })
          }
        })
        .catch(err => {
          done(err);
        })
    }
  )
)