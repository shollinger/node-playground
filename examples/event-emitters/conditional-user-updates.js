/**
* Event-driven example of conditionally sending updates to a user, based
* on a setting that can be manipulated at runtime to change if a module
* should be listening for an event.
**/
const events = require('events');
///////////////////////// Modules that would be in their own file
class UserAPI extends events.EventEmitter {};
class TwitterAPI extends events.EventEmitter {};

let shouldTweetOnUserLogin = true; // Init from Database in real app

function DatabaseUpdates(userApi) {
  userApi.on('user-data', (data) => {
    console.log('Save some entries to the database for user: ' + data);
    return 'done'; // This is ignored by Node
  });
}

function UserAlerts(userApi, twitterApi) {
  function alertUsers(data) {
    console.log('Alert users via Websocket: ' + data);
  }

  function turnUserLoginTweetOn() {
    console.log('Turning login tweet on');

    shouldTweetOnUserLogin = true;
    twitterApi.on('twitter-data', alertUsers);
    userApi.once('user-login-tweet-off', turnUserLoginTweetOff);
  }

  function turnUserLoginTweetOff() {
    console.log('Turning login tweet off');

    shouldTweetOnUserLogin = false;
    twitterApi.removeListener('twitter-data', alertUsers);
    userApi.once('user-login-tweet-on', turnUserLoginTweetOn);
  }

  userApi.on('user-data', (data) => {
    alertUsers('User logged in: ' + data);
  });

  if(shouldTweetOnUserLogin) {
    turnUserLoginTweetOn();
  } else {
    turnUserLoginTweetOff();
  }
}

function TwitterAlerts(userApi, twitterApi) {
  userApi.on('user-data', (data) => {
    console.log('Send a message to twitter about user: ' + data);

    // After sending to twitter, update listeners with twitter info
    twitterApi.emit('twitter-data', 'Tweet successful for: ' + data);
  });
}

/////////////////////////
/////////////////////////

module.exports = () => {
  // Event emitters
  const userAPI = new UserAPI();
  const twitterAPI = new TwitterAPI();

  // Areas of concern
  const db = new DatabaseUpdates(userAPI);
  const users = new UserAlerts(userAPI, twitterAPI);
  const twitter = new TwitterAlerts(userAPI, twitterAPI);

  // We got some new users!
  userAPI.emit('user-data', 'Krillin');
  userAPI.emit('user-data', 'Gohan');

  // Turn tweeting off b/c of some admin panel event,
  // and try again to see event fire only once
  userAPI.emit('user-login-tweet-off');
  userAPI.emit('user-login-tweet-off');

  // We got some new users! No update about tweets this time.
  userAPI.emit('user-data', 'Picalo');
  userAPI.emit('user-data', 'Vegita');

  // Turn it back on
  userAPI.emit('user-login-tweet-on');
  userAPI.emit('user-data', 'Son Goku'); // Will get a tweet update
};
