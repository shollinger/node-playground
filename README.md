# playground [![Build Status](https://secure.travis-ci.org/shollinger/node-playground.png?branch=master)](http://travis-ci.org/shollinger/node-playground)

# Contains basic examples of these features
## Promises
Promises are best understood if we look at how Javascript handles async code without them: callbacks.  Traditionally, you'd pass an argument to the async function that is itself a function to call when the async operation is done.

This approach can lead into "callback hell" and can be hard to read.  Further, error handling can be inconsistent between these async implementations.  Traditionally, people would pass as an argument to the callback an error if there was one, but this was just convention, and not standard.

```javascript
function myAsyncFunction(firstArg, secondArg, thirdArg, cb) {
  // Do things
  if(errCondition) {
    err = "It didn't work";
  } else {
    result = {foo:'bar'};
  }
  cb(err, result);
}

myAsyncFunction(some, argument, here, (err, result) => {
  if(err) {
    // handle error
  }
});
```

Promises are a way to standardize how callbacks should be defined and used.

```javascript
function myAsyncFunction(firstArg, secondArg, thirdArg) => {
  return new Promise((resolve, reject) => {
    // Do things
    if(errCondition) {
      reject("It didn't work");
    } else {
      resolve({foo:'bar'});
    }
  };
}

const theyPromisedThis = myAsyncFunction(some, argument, here);

// Now I can do things depending on what I need

// Only worry about success
theyPromisedThis.then((result)=>{ ... })

// Only worry about failure
theyPromisedThis.catch((err)=>{ ... });

// Handle it the old callback way
theyPromisedThis.then((result)=>{ // success }, (err) => { // fail });

// Chain handling
theyPromisedThis.then((result)=>{ ... })
                .then((result)=>{ ... })
                .catch((err)=>{ ... });

// Chain handle at different parts in the code
theyPromisedThis.then((result)=>{ ... });

///  Do other stuff here ///

if(conditionIsTrue) {
  theyPromisedThis.then((result)=>{ ... });
}

// Wait for all promises to finish
const theyPromisedThis = myAsyncFunction(some, argument, here);
const theyAlsoPromisedThis = myAsyncFunction(some, argument, here);

Promise.all(theyPromisedThis, theyAlsoPromisedThis).then((results)=>{ ... })
                                                   .then((results)=>{ ... })
                                                   .catch((err)=>{ ... });

```
Since `resolve` and `reject` are just functions, we can pass them around as we like when we're writing our async function that might call other async functions.

```javascript
function myAsyncFunction(firstArg, secondArg, thirdArg) => {
  return new Promise((resolve, reject)) => {
    // Do some prep work here ...

    // Pass resolve and reject to the handler for a third-party promise
    const thirPartyPromise = thirPartyDoSomething().then(resolve, reject);
  };
}
```

## Event Loop
![alt tag](https://ga-chicago.gitbooks.io/wdi-ravenclaw/content/07_fullstack_node/eventloop.png)

Node runs on the Javascript V8 engine, the same engine as Chrome.  Your Node server runs in the same thread, no matter how many connections are made!  How can the code be single threaded like this, and still be performant (and actually be more performant than most other servers)?  The anser to this is something called the Event Loop.

There are a two parts of the system to consider: the Stack and the Event Queue.

The Stack contains a list of functions (and data associated with them, like arguments) to be executed.  When a function is 'called' in Node, it is added to the top Stack.  The V8 engine will execute all the functions in the Stack, top-down, until it is empty.

The Event Queue is a list of functions that V8 wants to call 'sometime soon', when the Stack is empty.  When we want to perform an async operation, such as calling a Web API, the async function is executed outside the main application thread and always has a callback to call when it is done.  When the async function is complete, it will add the callback function to the Event Queue.  The Event Loop is an infinate loop that basically checks if there are items in the Event Queue and if the Stack is empty.  If that's true, it puts the items in the Event Queue onto the Stack to be executed.

Processing the server this way means that expensive I/O tasks (the most expensive part of any computer program) will always be non-blocking to Node's application thread.  Incoming requests from other clients will never have to wait for a connection thread from the connection pool, because whatever is being executed in it needs to perform I/O.  That is the case with many application servers, including Rails.

`process.nextTick(()=>{ ... }`) can be used to execute a function after the current turn in the event loop has completed.  Techincally, all `nextTick` functions get added to the "next tick queue" and the entire "next tick queue" is processed, in order, at the end of the event loop.  This is very similar to the Event Queue that async operations use, but not quite the same.  In theory, I could accidentally keep adding things to the "next tick queue", which would block all I/O callbacks from ever firing!  Because of that, it is recommended you use `setTimeout` or `setImmediate` instead of using `nextTick` more often than not.

`setTimeout` and `setImmediate` can be used to add function calls to the Event Queue.

Resources:

http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D

## Custom Events (not the same as Event Loop)
Events you'll see in Node application code have NOTHING to do with the event loop (to my suprise)! They are your normal event-driven abstraction.You can emit your own events from any object that extends `EventEmitter`.  You can listen for events on that module with `myModule.on(()=>{ ... });`

Emitting an event does not make it asyncronous!  It simply adds the event listeners for that event to the emitter's queue to be processed, in order, after the current event in the queue is complete.

## Websockets

## License
Copyright (c) 2016 shollinger
Licensed under the MIT license.
