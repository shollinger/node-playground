const EventEmitter = require('events');
class CatEmitter extends EventEmitter {}

module.exports = () => {
  const myCatEmitter = new CatEmitter();

  myCatEmitter.on('meow', () => {
    console.log('MEOW!!!');
  });

  process.nextTick(() => {
    console.log('MEOW happened already');
  });

  myCatEmitter.emit('meow');
}
