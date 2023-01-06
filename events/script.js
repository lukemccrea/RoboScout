let now = new Date()

let query = {
  query: `{
  eventsBetween(
    before: "${new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString()}"
    after: "${now.toISOString()}"
  ) {
    id
    name
    program {
      name
      id
    }
    start
  }
}`
};

console.log(query.query)

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  //Sort the events with closest first.
  let data = xhr.response.data.eventsBetween.sort(
  (objA, objB) => Number(new Date(objA.start)) - Number(new Date(objB.start)),
);
  let html = `
  <table>
    <tr>
      <th>Event</th>
      <th>Program</th>
      <th>Start</th>
    </tr>
  `;

  for(i=0; i<data.length; i++){
    html += `
    <tr>
      <td><a href='/events/view/index.html?e=${data[i].id}'>${data[i].name}</a></td>
      <td>${data[i].program.name}</td>
      <td>${new Date(data[i].start).toLocaleDateString()}</td>
    </tr>
    `
  }
  document.getElementById('results').innerHTML = html;
}
xhr.send(JSON.stringify(query));

//Adds search functionality to nav search bar
const navSearch = document.getElementById('navSearch');

function search(i) {
  let query = i.value;
  if (query.trim().length != 0) {
    window.location.href = '/search/index.html?i=' + encodeURIComponent(query);
  }
}

navSearch.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    search(navSearch);
  }
});