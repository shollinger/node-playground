const EventEmitter = require('events');
class CatEmitter extends EventEmitter {}

module.exports = () => {
  const myCatEmitter = new CatEmitter();

  myCatEmitter.on('meow', () => {
    console.log('MEOW!!!'); // This Second
  });

  myCatEmitter.on('meow', () => {
    console.log('MEOW 2!!!'); // This Third (listeners go in order)
  });

  console.log('Get ready...'); // This first

  myCatEmitter.emit('meow');
}
