const tplUser = `
  <img src="<%= src %>" />
  <a href="#" target="_blank" class="username"><%= username %></a>
  <a href="#" class="close close<%= idx %>">x</a>`;

const refreshOnClick$ = Rx.Observable.fromEvent(document.querySelector('.refresh'), 'click');

const request$ = refreshOnClick$
  .startWith('startup click')
  .map(() => {
    const randomOffset = Math.floor(Math.random() * 500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

const response$ = request$
  .flatMap(reqUrl => {
    return Rx.Observable.fromPromise($.getJSON(reqUrl));
  });

function createSuggestion$(response$) {
  return response$
    .map(users => {
      const index = Math.floor(Math.random() * users.length);
      return users[index];
    })
    .merge(refreshOnClick$.map(() => null))
    .startWith(null);
}

function generateUserHtml(user, idx) {
  if (user === null) {
    return '';
  }

  return tplUser
    .replace('<%= idx %>', idx)
    .replace('<%= src %>', user.avatar_url)
    .replace('<%= username %>', user.login);
}

function renderUser(user, targetSelector) {
  const idx = targetSelector[targetSelector.length - 1];

  document
    .querySelector(targetSelector)
    .innerHTML = generateUserHtml(user, idx);
};

createSuggestion$(response$)
  .subscribe((suggestion) => {
    renderUser(suggestion, '.suggestion1');
  });

createSuggestion$(response$)
  .subscribe((suggestion) => {
    renderUser(suggestion, '.suggestion2');
  });

createSuggestion$(response$)
  .subscribe((suggestion) => {
    renderUser(suggestion, '.suggestion3');
  });