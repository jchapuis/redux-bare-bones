import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/scan';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// Type definition for redux actions
interface Action {
  type: string;
  payload: string;
}

// Type definition for application state
interface State {
  text: string;
}

// Create our stream: rx subjects allow for both pushing data into the stream and subscribing
const action$ = new Subject<Action>();

// Initial State
const initialState: State = { text: 'Rx' };

// Redux reducer
function reducer(prevState: State, action: Action): State {
  console.log(`reducing action ${action.type}`);
  switch (action.type) {
    case 'TEXT_CHANGED':
      return {
        text: action.payload
      };
    default:
      return prevState;
  }
}

// Reduxification
const store$ = Observable.concat(
  Observable.of(initialState),
  action$.scan(reducer, initialState));

// Higher order function to send actions to the stream
function dispatchAction(action: Action) {
  console.log(`dispatching action ${action.type}`);
  action$.next(action);
}

// Example action function
function changeText(newText: string) {
  dispatchAction({
    type: 'TEXT_CHANGED',
    payload: newText
  });
}

// React App component 
function App(state: State): React.ReactElement<any> {
  return (  // JSX elements produce React "elements" - they are syntactic sugar for React.createElement()
    <div>
      <h1>{state.text}</h1>
      <button onClick={() => changeText('Rx')}>Rx</button>
      <button onClick={() => changeText('Rocks')}>Rocks</button>
    </div>
  );
}

// Subscribe and render the view
store$.subscribe((state: State) => {
  console.log(`rendering app`);
  ReactDOM.render(<App {...state} />, document.getElementById('app'));
});