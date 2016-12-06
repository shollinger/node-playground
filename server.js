const eventLoop = require('./examples/event-loop/event-loop');
const eventLoopNoEventQueue = require('./examples/event-loop/event-loop-no-event-queue');
const emitEvent = require('./examples/event-emitters/emit-an-event');
const conditionalUserUpdates = require('./examples/event-emitters/conditional-user-updates');

//eventLoop();
//eventLoopNoEventQueue();
//emitEvent();
conditionalUserUpdates();
