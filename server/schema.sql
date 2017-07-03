-- DROP DATABASE IF EXISTS events_app;

--  Now we have heroku databaase
--  To connect schema to heroku postgres
-- heroku pg:psql postgresql-transparent-46296 --app eventwire < server/schema.sql;
-- shell
-- drop schema public cascade;
-- create schema public

-- /* To connect to local
-- psql -U userName dbName < server/schema.sql
-- psql dbname username


-- CREATE DATABASE events_app;
-- \c events_app;
DROP SCHEMA if exists event_app CASCADE;
-- CREATE SCHEMA public AUTHORIZATION qbzvgvuvdevbhj;

DROP TABLE if exists users;
DROP TABLE if exists events;
DROP TABLE if exists users_events;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  password TEXT NOT NULL,
  salt VARCHAR(100) NOT NULL,
  UNIQUE (name)
);

CREATE TABLE events (
  id serial PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  dateAndTime VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  description VARCHAR(8000) NOT NULL,
  location VARCHAR(500) NOT NULL,
  UNIQUE (name)
);


CREATE TABLE users_events (
  userId serial REFERENCES users (id),
  eventId serial REFERENCES events (id)
);

INSERT INTO users (name, password, salt) VALUES ('julia', 'hellowpass', 'salt1');
INSERT INTO users (name, password, salt) VALUES ('jey', 'mypassword', 'salt2');
INSERT INTO users (name, password, salt) VALUES ('kevin', 'heypass', 'salt3');
INSERT INTO users (name, password, salt) VALUES ('li', 'password123', 'salt4');



INSERT INTO events (name, dateAndTime, category, url, description, location) VALUES ('Jeys Music Show', '2017-06-28', 'music', 'http://sanfrancisco.eventful.com/events/', 'Jeys music sucks but come on by', 'San Francisco St');

INSERT INTO events (name, dateAndTime, category, url, description, location) VALUES ('Kitten Petting Party', '2017-06-29', 'animals', 'http://sanfrancisco.eventful.com/events/', 'Come and pet all the kitties!', 'Oakland Blvd');

INSERT INTO events (name, dateAndTime, category, url, description, location) VALUES ('Lis Art Show', '2017-06-29', 'art', 'http://sanfrancisco.eventful.com/events/', 'Art by Li, must come and see!', 'Hayward St');

INSERT INTO events (name, dateAndTime, category, url, description, location) VALUES ('Kevins Pizza Cook Off!', '2017-07-01', 'food', 'http://sanfrancisco.eventful.com/events/', 'Dare to challenge Kevin in a pizza cook off!', 'Berkeley Blvd');


INSERT INTO users_events (userId, eventId) VALUES (1, 2);
INSERT INTO users_events (userId, eventId) VALUES (1, 4);
INSERT INTO users_events (userId, eventId) VALUES (2, 1);
INSERT INTO users_events (userId, eventId) VALUES (3, 1);
INSERT INTO users_events (userId, eventId) VALUES (3, 2);
INSERT INTO users_events (userId, eventId) VALUES (3, 3);




