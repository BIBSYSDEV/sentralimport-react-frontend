Cypress.Commands.add('login', () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const epoch = ((date.getTime().toString() - date.getMilliseconds()) / 100).toString();
  console.log(epoch);
  window.localStorage.setItem('config', '{ "headers": { "Authorization": "Bearer mock-token" } }');
  window.localStorage.setItem('authorized', 'true');
  window.localStorage.setItem('id_token', 'mock-token');
  window.localStorage.setItem('access_token', 'mock-token');
  window.localStorage.setItem('nonce', 'mock-nonce');
  window.localStorage.setItem('expires', epoch);
  window.localStorage.removeItem('tempContributors');
});
