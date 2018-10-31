const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose');
// temp DB vars until config is set up
const dbName = "klackmongo";
const DB_USER = "admin";
const DB_PASSWORD = "admin1";
const DB_URI = "ds133642.mlab.com:33642"

// process.env.CONNECTION_STRING 
const connectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URI}/${dbName}`

app.use(express.static("./public"));
app.use(express.json());

// Track last active times for each sender
let users = {};

// generic comparison function for case-insensitive alphabetic sorting on the name field
function userSortFn(a, b) {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

app.get("/messages", (request, response) => {
  // get the current time
  const now = Date.now();

  // consider users active if they have connected (GET or POST) in last 15 seconds
  const requireActiveSince = now - 15 * 1000;

  // create a new list of users with a flag indicating whether they have been active recently
  usersSimple = Object.keys(users).map(x => ({
    name: x,
    active: users[x] > requireActiveSince
  }));

  // sort the list of users alphabetically by name
  usersSimple.sort(userSortFn);
  usersSimple.filter(a => a.name !== request.query.for);

  // update the requesting user's last access time
  users[request.query.for] = now;

  // send the latest 40 messages and the full user list, annotated with active flags
  response.send({ messages: messages.slice(-40), users: usersSimple });
});

app.post("/messages", (request, response) => {
  // add a timestamp to each incoming message.
  const timestamp = Date.now();
  request.body.timestamp = timestamp;

message.create({
    sender: request.body.sender,
    message: request.body.message,
    timestamp: request.body.timestamp
})

  // append the new message to the message list
  messages.push(request.body);

  // update the posting user's last access timestamp (so we know they are active)
  users[request.body.sender] = timestamp;

  // Send back the successful response.
  response.status(201);
  response.send(request.body);
});

app.listen(port, () => {
    mongoose.connect(connectionString, { useNewUrlParser: true})
    console.log(`listening on http://localhost:${port}`)
});