/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import validate from './validationURL.js';
import parse from './parseRSS.js';
import visualize from './view.js';

const proxify = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`;

const additionalResponse = (state) => {
  const added = state.rssForm.alreadyAddedRsss;
  added.forEach((link) => {
    axios.get(proxify(link))
      .then((response) => {
        const responseList = parse(response.data.contents);
        const newPosts = _.differenceBy(responseList.posts, state.data.posts, 'title');
        newPosts.forEach((post) => {
          post.id = _.uniqueId();
        });
        const posts = [...newPosts, ...state.data.posts];
        state.data.posts = posts;
        state.rssForm.state = 'posts updated';
      });
  });
  setTimeout(() => additionalResponse(state), 5000);
};

const makeResponse = (state, link) => {
  axios.get(proxify(link))
    .then((response) => {
      const responseList = parse(response.data.contents);
      responseList.posts.forEach((post) => {
        post.id = _.uniqueId();
      });
      const posts = [...responseList.posts, ...state.data.posts];
      state.data.posts = posts;
      state.data.feeds = [responseList.feed, ...state.data.feeds];
      state.rssForm.alreadyAddedRsss.push(link);
      state.rssForm.feedback = 'success';
      state.rssForm.state = 'successfully responsed';
    })
    .catch((e) => {
      if (e.message === 'Network Error') {
        state.rssForm.feedback = 'errors.networkError';
      } else {
        state.rssForm.feedback = 'errors.noValidRss';
      }
      state.rssForm.state = 'failed';
    })
    .then(() => setTimeout(() => additionalResponse(state), 5000));
};

export const handlerLangButton = (state, i18nInstance, event, elements) => {
  if (event.target.classList.contains('langButton')) {
    const { lang } = event.target.dataset;
    i18nInstance.changeLanguage(lang);
    const watchedState = visualize(state, i18nInstance, elements);
    watchedState.lang = i18nInstance.language;
  }
};

export const handlerForm = (state, i18nInstance, e, elements) => {
  const watchedState = visualize(state, i18nInstance, elements);
  e.preventDefault();
  const formData = new FormData(e.target);
  const rssUrl = formData.get('url');
  const errors = validate({ url: rssUrl }, state);
  watchedState.rssForm.valid = errors.length === 0;
  if (!watchedState.rssForm.valid) {
    watchedState.rssForm.feedback = errors;
    watchedState.rssForm.state = 'failed';
  } else {
    watchedState.rssForm.state = 'pending';
    makeResponse(watchedState, rssUrl);
  }
};

export const handlerClick = (state, i18nInstance, event, elements) => {
  if (event.target.dataset.id) {
    const watchedState = visualize(state, i18nInstance, elements);
    const viewedId = event.target.dataset.id;
    watchedState.ui.viewedPosts.add(viewedId);
    watchedState.ui.currentModalId = viewedId;
  }
};
