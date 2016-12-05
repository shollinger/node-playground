const EventEmitter = require('events');
///////////////////////// Modules that would be in their own file
class UserAPI extends EventEmitter {};
class TwitterAPI extends EventEmitter {};


function saveToMainDB(userApi) {
  userApi.on('user-data', (data) => {
    console.log('Save some entries to the database: ' + data);
    return 'done'; // This is ignored by Node
  });
}

function alertUsers(userApi, twitterApi) {
  userApi.on('user-data', (data) => {
    console.log('Alert some users via Websocket about user data: ' + data);
  });

  twitterApi.on('twitter-data', (data) => {
    console.log('Alert some users via Websocket about twitter data: ' + data);
  });
}

function alertTwitter(userApi, twitterApi) {
  userApi.on('user-data', (data) => {
    console.log('Send a message to twitter about users: ' + data);

    // After sending to twitter, update listeners with twitter info
    twitterApi.emit('twitter-data', 'Tweet successful!');
  });
}

/////////////////////////
/////////////////////////

module.exports = () => {
  // Event emitters
  const userAPI = new UserAPI();
  const twitterAPI = new TwitterAPI();

  // Areas of concern
  const db = new saveToMainDB(userAPI);
  const users = new alertUsers(userAPI, twitterAPI);
  const twitter = new alertTwitter(userAPI, twitterAPI);

  // Do something, like log the results
  userAPI.on('user-data', console.log);
  twitterAPI.on('twitter-data', console.log);

  // We got a new user!
  userAPI.emit('user-data', 'Joe Schmoe');
};
