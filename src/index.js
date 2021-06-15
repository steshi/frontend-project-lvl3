import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import 'i18next';
import _ from 'lodash';
import validate from './validationURL.js';
import watchedState from './view.js';
import parse from './parseRSS.js';

const getRSS = (url) => axios.get(url).then((result) => result);

const form = document.querySelector('form', '.rss-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const rssUrl = formData.get('url');
  const errors = validate({ url: rssUrl }, watchedState);
  console.log('cccccccc', errors);
  watchedState.rssForm.valid = _.isEqual(errors, []);
  watchedState.rssForm.validationErrors = errors;

  // watchedState.rssForm.state = 'pending!';
  getRSS(rssUrl)
    .then((response) => {
      if (response.status === 200) {
        watchedState.rssForm.state = 'successfully responsed';
        const responseList = parse(response);
        console.log(3333333, responseList);
        watchedState.rssForm.added.push(rssUrl);
      }
    });
});
