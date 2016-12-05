const EventEmitter = require('events');
class CatEmitter extends EventEmitter {}

module.exports = () => {
  const myCatEmitter = new CatEmitter();

  myCatEmitter.on('meow', () => {
    console.log('MEOW!!!');
  });

  myCatEmitter.on('meow', () => {
    console.log('MEOW 2!!!');
  });

  console.log('Get ready...');

  myCatEmitter.emit('meow');
}
