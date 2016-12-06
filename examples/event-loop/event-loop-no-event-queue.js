module.exports = () => {
  // Added to the Event Queue to be added to the Stack, when the Stack is empty
  setTimeout(()=> {
    console.log('SetTimeout 0');
  },0);

  setTimeout(()=> {
    console.log('SetTimeout 1000');
  },1000);

  // This will starve the event queue for a few seconds,
  // meaning no I/O operations or other requests can be processed!

  process.nextTick(() => {
    const start = new Date().getTime();
    let shouldEnd = false;

    while(!shouldEnd) {
      let current = new Date().getTime();
      let elapased = current - start;

      if(elapased < 3000) {
        process.nextTick(() => {
        // Don't do anything so you can see no output except MEOW!!!
        });
      } else {
        shouldEnd = true;
      }
    }
  });

  console.log('MEOW!!!');
}
