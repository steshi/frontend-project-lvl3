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

const additionalResponse = (state) => {
  const added = state.rssForm.alreadyAddedRsss;
  added.forEach((link) => {
    getRSS(link)
      .then((response) => {
        if (response.data.status.http_code === 200) {
          const responseList = parse(response.data.contents);
          console.log('POSTS in state', 1111111111111, state.data.posts);
          console.log('POSTS in current response', 222222222, responseList.posts);
          // const newPosts = _.differenceBy(responseList.posts, state.data.posts, 'title');
          // console.log('NEW POSTS', 333333, newPosts);
          // state.data.posts = [...state.data.posts, ...newPosts];
        }
      });
  });
  setTimeout(() => additionalResponse(state), 20000);
};

const makeResponse = (state, link) => {
  getRSS(link)
    .then((response) => {
      if (response.data.status.http_code !== 200) {
        state.rssForm.feedback = 'errors.noValidRss';
        state.rssForm.state = 'bad responsed';
      } else {
        const responseList = parse(response.data.contents);
        state.data.posts = [...state.data.posts, ...responseList.posts];
        state.data.feeds = [...state.data.feeds, responseList.feed];
        state.rssForm.alreadyAddedRsss.push(link);
        state.rssForm.feedback = 'success';
        state.rssForm.state = 'successfully responsed';
      }
    })
    .then(() => additionalResponse(state));
};

export const handlerForm = (state, i18nInstance, e) => {
  const watchedState = visualize(state, i18nInstance);
  e.preventDefault();
  watchedState.rssForm.state = '----------------start-----------------';
  const formData = new FormData(e.target);
  const rssUrl = formData.get('url');
  const errors = validate({ url: rssUrl }, state);
  watchedState.rssForm.valid = _.isEqual(errors, []);
  // watchedState.rssForm.errors = errors.map((err) => err.message);
  if (!watchedState.rssForm.valid) {
    watchedState.rssForm.feedback = errors;
    watchedState.rssForm.state = 'failed';
  } else {
    watchedState.rssForm.state = 'pending';
    makeResponse(watchedState, rssUrl);
  }
};
