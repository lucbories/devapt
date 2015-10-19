



All UI actions are dispatched through a Redux dispatching function.


Record field value is updated, should update UI
	loop on Record linked containers
		dispatch(RECORD_UPDATED, Record, update source name)


UI update a linked Record value, should update Record and Record attached datasource:
	Record.fieldA( {new_value, update source name} ): stream reactor to update Record value and datasource
    do UI update
	

Redux on Record:
actions:
  RECORD_CREATED, RECORD_UPDATED, RECORD_DELETED,
  RECORD_CREATE, RECORD_RELOAD, RECORD_SAVE, RECORD_DELETE
payload: { record: Record instance or , field_name: String, new_value: anything, origin_name: String }
  with origin_name: name of the View or Model which update/delete/create the Record
reducer:
  Record.reducer(state, action, payload):new state


Redux on Container View:
actions:
payoad:
reducer:


Redux on Container View:
actions:
payoad:
reducer:



Example:


import { combineReducers } from 'redux';
import { VisibilityFilters } from './actions';

function todos(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, {
      text: action.text,
      completed: false
    }];
  case COMPLETE_TODO:
    return [
      ...state.slice(0, action.index),
      Object.assign({}, state[action.index], {
        completed: true
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return action.filter;
  default:
    return state;
  }
}


const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;




/**
 * Logs all actions and states after they are dispatched.
 */
const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
};

/**
 * Sends crash reports as state is updated and listeners are notified.
 */
const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    console.log('dispatching', action);
	console.log('state', store.getState());
    throw err;
  }
}

/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 */
const timeoutScheduler = store => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action);
  }

  let timeoutId = setTimeout(
    () => next(action),
    action.meta.delay
  );

  return function cancel() {
    clearTimeout(timeoutId);
  };
};

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */
const readyStatePromise = store => next => action => {
  if (!action.promise) {
    return next(action)
  }

  function makeAction(ready, data) {
    let newAction = Object.assign({}, action, { ready }, data);
    delete newAction.promise;
    return newAction;
  }

  next(makeAction(false));
  return action.promise.then(
    result => next(makeAction(true, { result })),
    error => next(makeAction(true, { error }))
  );
};


import { createStore, combineReducers, applyMiddleware } from 'redux';

// applyMiddleware takes createStore() and returns
// a function with a compatible API.
let createStoreWithMiddleware = applyMiddleware(logger, crashReporter)(createStore);

// Use it like you would use createStore()
let todoApp = combineReducers(reducers);
let store = createStoreWithMiddleware(todoApp);



Undo/Redo:
url: http://rackt.org/redux/docs/recipes/ImplementingUndoHistory.html

{
  past: Array<T>,
  present: T,
  future: Array<T>
}

function undoable(reducer) {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };

  // Return a reducer that handles undo and redo
  return function (state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case 'REDO':
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    default:
      // Delegate handling the action to the passed reducer
      const newPresent = reducer(present, action);
      if (present === newPresent) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }
  };
}

// This is a reducer
function todos(state = [], action) {
  /* ... */
}

// This is also a reducer!
const undoableTodos = undoable(todos);

import { createStore } from 'redux';
const store = createStore(undoableTodos);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
});

store.dispatch({
  type: 'ADD_TODO',
  text: 'Implement Undo'
});

store.dispatch({
  type: 'UNDO'
});