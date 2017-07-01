var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var passport = require('passport');
var models = require('./models');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('passport-local-authenticate');
var db = require('./database');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var app = express();
var rp = require('request-promise');



app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/../react-client/dist'));

var database = {
  username: 'david',
  password: 'sucks'
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  function(username, password, done) {
    console.log(username, password);
    if (username === database.username) {
      return done(null, database);
    }
  }
));

app.get('/register', function(req, res) {
  res.render('register');
})

app.post('/register', function(req, res) {
  // auth.hash(req.body.password, function(err, hashed) {
  //   console.log(hashed.hash);
  //   console.log(hashed.salt);
  var hash = bcrypt.hashSync(req.body.password, salt);

    db.query(`select * from users where name = '${req.body.name}'`).
    then((users) => {
      console.log('this is the user', users);
      if (users.length) {
        res.end('User already exists!');
      } else {
        db.query(`INSERT INTO users (name, password) VALUES ('${req.body.name}', '${hash}')`).
          then((users) => {
            res.end();
            //where we will pass the token back inside res.end
          })
          .catch(error => {
            res.end(JSON.stringify(error));
          })

      }
    })
    .catch(error => {
      console.log(error);
      res.end();
    });
  });

app.post('/login', function(req, res) {

  // console.log(req.body);
  var hash = bcrypt.hashSync(req.body.password, salt);
  // console.log(hash);
  db.query(`select * from users where name = '${req.body.name}'`).
    then((user) => {
      if (user) {
        if(user[0].password === hash) {
        res.end('successful login');
        }
      } else {
        res.writeHead(403, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'user doesn\'t exist or password is incorrect'}));
      }
    })
})

app.get('/login', function(req, res) {
  res.render('login');
})


/*
verifies password: this will return a boolean (true if pswd matches)
auth.hash('password', function (err, hashed) {
  auth.verify('password', hashed, function(err, verified) {
    console.log(verified);
  })
})
*/
app.post('/login', passport.authenticate('local', {}),
  function(req, res) {

  res.end('testing ');
});
  // passport.authenticate('local', {
  //                                 successRedirect: '/',
  //                                 failureRedirect: '/login',
  //                                 failureFlash: 'Invalid username or password.',
  //                                 successFlash: 'Welcome!' })
  // );


app.post('/eventful', function (req, res) {
  // var data = JSON.parse(req.body);
  console.log(req.body);
  var loc = '&l=' + req.body.location.split(' ').join('+');
  var topic = req.body.topic; 
  var returnData;
  var eventfulOptions = { method: 'GET',
  url: 'http://api.eventful.com/json/events/search',
  qs: { app_key: 'CwcF9Lt3qkKh4gWB', l: 'san francisco' },
  headers:
   { l: 'san%20francisco',
     q: topic,
     date: 'future' } };

    rp(eventfulOptions).then(function (data) {
      var eventData;
      if(data) {
        eventData = JSON.parse(data).events.event.map((singleEvent) => {
          var item = {
            name: singleEvent.title,
            time: singleEvent.start_time,
            category: topic,
            url: singleEvent.url,
            image: singleEvent.image,
            description: singleEvent.description,
            location: singleEvent.venue_address
          };
          return item;
        })
      }
      eventData = JSON.stringify(eventData);
      returnData += eventData.substring(0, eventData.length - 1);
      res.write(eventData.substring(0, eventData.length - 1));
      return;
    }).then( () => {
        var meetupCategories = 
        {
          // meetup searches catagories by numbers
          // it is weird but functional
          music: 21,
          food: 10,
          arts: 1,
          books: 18,
          animals: 26,
        }

        var meetupOptions = {
        method: 'GET',
        url: 'https://api.meetup.com//find/groups',
        qs:
       { sign: 'true',
         key: '2771396637a6981749467c7663e19',
         category: meetupCategories[topic] }
        }

        rp(meetupOptions).then(function (data) {
            if(data) {
              var eventData = JSON.parse(data).map((singleEvent) => {
                var checkTime;
                if(singleEvent.next_event){
                  checkTime = singleEvent.next_event.time;
                }
                var item = {
                  name: singleEvent.name,
                  time: checkTime,
                  category: topic,
                  url: singleEvent.link,
                  image: singleEvent.image,
                  description: singleEvent.description,
                  location: singleEvent.city +', '+ singleEvent.state
                };
                return item;
              })
            }
            eventData = JSON.stringify(eventData);
            returnData += ',' + eventData.substring(1, eventData.length );
            res.write(',' + eventData.substring(1, eventData.length ));
            res.end();
        })
      })
});

app.post('/save', function (req, res) {
  console.log(req.body);
  var event = req.body.event;
  //var userName = JSON.parse(req.body).userName;
  //models.users.saveEvent(userName, event);
});

app.get('/meetup', function(req, res) {
  res.send('get sucessful at meetup');
});

app.post('', function (req, res) {
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

