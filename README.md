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

## Events and Event Loop
![alt tag](https://ga-chicago.gitbooks.io/wdi-ravenclaw/content/07_fullstack_node/eventloop.png)

Node is an event-driven system that has a master event loop that determines when functions get executed.

Node has an infinate loop that listens for events and executes their listeners in the order they are registered.  This loop will wait for one event to finish executing before it moves on to the next event. In this way, event handling is synchronous!  Therefore, it is important that none of your code is 'blocking' the function from completing (like sleeping waiting for some I/O like writing to the disk).

You can emit your own events from any object that extends `EventEmitter`.  You can listen for events on that module with `myModule.on(()=>{ ... });`

Emitting an event does not make it asyncronous!  It simply adds the event listeners for that event to the *task queue* to be processed, in order, after the current event in the queue is complete (likely the task that is running the code that is emitting the event).

`process.nextTick(()=>{ ... }`) can be used to execute a function after the current turn in the event loop has completed.  Techincally, all `nextTick` functions get added to the "next tick queue" and the entire "next tick queue" is processed, in order, at the end of the event loop.

## Websockets

## License
Copyright (c) 2016 shollinger
Licensed under the MIT license.
