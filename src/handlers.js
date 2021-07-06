/* eslint-disable no-param-reassign */
import _ from 'lodash';
import getRSS from './getRSS.js';
import validate from './validationURL.js';
import parse from './parseRSS.js';
import visualize from './view.js';

export const handlerLangButton = (state, i18nInstance) => {
  const watchedState = visualize(state, i18nInstance);
  watchedState.lang = i18nInstance.language;
};

export const handlerForm = (state, i18nInstance, e) => {
  const watchedState = visualize(state, i18nInstance);
  e.preventDefault();
  watchedState.rssForm.state = '----------------start-----------------';
  const formData = new FormData(e.target);
  const rssUrl = formData.get('url');
  const errors = validate({ url: rssUrl }, state);
  console.log(1111111, errors);
  watchedState.rssForm.valid = _.isEqual(errors, []);
  // watchedState.rssForm.errors = errors.map((err) => err.message);
  if (!watchedState.rssForm.valid) {
    watchedState.rssForm.feedback = errors;
    watchedState.rssForm.state = 'failed';
  } else {
    watchedState.rssForm.state = 'pending';
    getRSS(rssUrl)
      .then((response) => {
        if (response.data.status.http_code !== 200) {
          watchedState.rssForm.feedback = 'errors.noValidRss';
          watchedState.rssForm.state = 'bad responsed';
        } else {
          const responseList = parse(response.data.contents);
          watchedState.data.push(responseList);
          watchedState.rssForm.alreadyAddedRsss.push(rssUrl);
          watchedState.rssForm.feedback = 'success';
          watchedState.rssForm.state = 'successfully responsed';
        }
      });
  }
};
