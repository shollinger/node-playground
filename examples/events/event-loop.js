module.exports = () => {
  // Added to the Event Queue to be added to the Stack, when the Stack is empty
  setTimeout(()=> {
    console.log('SetTimeout');
  },0);

  // This is deferred until the end of the current event loop, but
  // will fire before other async callbacks, like the one above.
  process.nextTick(() => {
    console.log('Next tick 1');
  });
  process.nextTick(() => {
    console.log('Next tick 2');
  });

  console.log('MEOW!!!');
}
