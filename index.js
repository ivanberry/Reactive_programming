/**
 * - On startup, load accounts data from the API and display 3 suggestions
 * - On clicking "Refresh", load 3 other account suggests into the  3 rows
 * - On click "x" button on an account row, clear only that current account and display another
 * - Each row displays the account's avator links to their page
 */

//Ulti
function request(url, method, data) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = function (res) {
    return new Promise(function (resolve, reject) {
      if (xhr.onreadystate >= 200 && xhr.onreadystate <= 300) {
        resolve(res);
      } else {
        reject(res);
      }
    })
  };
  xhr.send(data);
}

const URL = 'https://api.github.com/users';

// const requestStream = Rx.Observable.of(URL); //just stream of strings

// let responseStream = requestStream
// .flatMap(requestURL => Rx.Observable.fromPromise(fetch(URL)));

// responseStream.subscribe(response => {
//   response.json()
//   .then(data => {
//     return data.map(user => {
//       return renderProfile(user)
//     }).join('')
//   })
//   .then(html => renderAdDom(document.getElementById('root'), html))
//   .catch(err => console.log(err))
// });


//refactor with refresh button

let refreshButton = document.getElementById('refresh');
let refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

var requestStream = refreshClickStream.startWith('startup click')
  .map(function () {
    let randomOffset = Math.floor(Math.random() * 500);
    return `https://api.github.com/users?since=${randomOffset}`;
  });

let responseStream = requestStream
.flatMap(requestUrl => Rx.Observable.fromPromise(fetch(requestUrl).then(res => res.json())));

let suggest1Stream = responseStream
.map(function (listUsers) {
  return listUsers[Math.floor(Math.random() * listUsers.length)];
});

suggest1Stream.subscribe(suggest => {
  renderAdDom(document.getElementById('root'), renderProfile(suggest));
});

function renderProfile(user) {
  const GITHUB = 'https://github.com';
  return `
  <li>
    <a href='https://github.com/${user.login}'>
      <img width='40' height='40' src=${user.avatar_url} />
    </a>
    <span>${user.login}</span>
  </li>`
}

function renderAdDom(container, html) {
  container.innerHTML = html;
}
