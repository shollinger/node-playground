module.exports = () => {
  // Added to the Event Queue to be added to the Stack, when the Stack is empty
  setTimeout(()=> {
    console.log('SetTimeout 0');
  },0);

  setTimeout(()=> {
    console.log('SetTimeout 1000');
  },100);

  // This is deferred until the end of the current event loop, but
  // will fire before other async callbacks, like the one above.

  for(var i = 0; i < 3000; i++) {
    process.nextTick(() => {
      console.log('Next tick ' + i);
    });
  }

  console.log('MEOW!!!');
}
