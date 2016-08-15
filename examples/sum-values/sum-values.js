function createInputNumberStream(el) {
  return Rx.Observable
    .fromEvent(el, 'keyup')
    .map(e => parseInt(e.target.value || 0, 10))
    .startWith(parseInt(el.value, 10));
}

function createSumStream(a$, b$) {
  return Rx.Observable
    .combineLatest(a$, b$)
    .map(values => values.reduce((acc, cur) => acc + cur));
}

(function main() {
  const a1$ = createInputNumberStream(document.getElementById('a1'));
  const b1$ = createInputNumberStream(document.getElementById('b1'));
  const result$ = createSumStream(a1$, b1$);

  result$.subscribe(res => document.getElementById('result').value = res);
})();
