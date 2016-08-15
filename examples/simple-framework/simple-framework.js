function intent(el) {
  const elIncrement = el.querySelector('#increment');
  const elDecrement = el.querySelector('#decrement');

  return {
    incrementClick$: Rx.Observable.fromEvent(elIncrement, 'click'),
    decrementClick$: Rx.Observable.fromEvent(elDecrement, 'click')
  }
}

function model(action$) {
  const initialState = 0;

  return Rx.Observable.of(initialState)
    .merge(
      Rx.Observable
        .merge(
          action$.incrementClick$.map(state => (state) => state + 1),
          action$.decrementClick$.map(state => (state) => state - 1)
        )
    )
    .scan((state, reducer) => reducer(state));
}

function view(state$) {
  return state$.map(val => document.querySelector('#val').innerHTML = val);
}

function main(el) {
  const action$ = intent(el);
  const state$ = model(action$);
  const render$ = view(state$);

  return render$;
}

function run(main, { DOM }) {
  main(DOM).subscribe();
}

run(main, {
  DOM: document
});