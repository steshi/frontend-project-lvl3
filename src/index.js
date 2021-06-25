import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'i18next';
import _ from 'lodash';
import getRSS from './getRSS.js';
import validate from './validationURL.js';
import watchedState from './view.js';
import parse from './parseRSS.js';

const form = document.querySelector('form', '.rss-form');
form.addEventListener('submit', (e) => {
  watchedState.rssForm.state = 'start';
  e.preventDefault();
  const formData = new FormData(e.target);
  const rssUrl = formData.get('url');
  const errors = validate({ url: rssUrl }, watchedState);
  watchedState.rssForm.valid = _.isEqual(errors, []);
  watchedState.rssForm.errors = errors.map((err) => err.message);
  if (watchedState.rssForm.valid) {
    watchedState.rssForm.state = 'pending';
    getRSS(rssUrl)
      .then((response) => {
        if (response.data.status.http_code !== 200) {
          watchedState.rssForm.state = 'bad responsed';
          watchedState.rssForm.errors = [...watchedState.rssForm.errors, 'this URL has no valid RSS'];
        } else {
          const responseList = parse(response.data.contents);
          watchedState.data.push(responseList);
          console.log('sucessfully resssssssssponsed', response.data.contents);
          watchedState.rssForm.addedList.push(rssUrl);
          watchedState.rssForm.state = 'successfully responsed';
        }
      });
  }
});
