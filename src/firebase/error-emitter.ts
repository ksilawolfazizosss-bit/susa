import { EventEmitter } from 'events';

// This is a simple event emitter to allow different parts of the app
// to communicate without direct dependencies. It's used here to
// propagate Firestore permission errors to a central listener.
export const errorEmitter = new EventEmitter();
