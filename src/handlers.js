/* eslint-disable no-param-reassign */
import _ from 'lodash';
import getRSS from './getRSS.js';
import validate from './validationURL.js';
import parse from './parseRSS.js';
import visualize from './view.js';

const additionalResponse = (state) => {
  const added = state.rssForm.alreadyAddedRsss;
  added.forEach((link) => {
    getRSS(link)
      .then((response) => {
        const responseList = parse(response.data.contents);
        const newPosts = _.differenceBy(responseList.posts, state.data.posts, 'title');
        state.rssForm.state = 'start';
        const posts = [...newPosts, ...state.data.posts];
        posts.forEach((post) => {
          post.id = posts.length - posts.indexOf(post);
        });
        state.data.posts = posts;
      });
  });
  setTimeout(() => additionalResponse(state), 35000);
};

const makeResponse = (state, link) => {
  getRSS(link)
    .then((response) => {
      const responseList = parse(response.data.contents);
      const posts = [...responseList.posts, ...state.data.posts];
      posts.forEach((post) => {
        post.id = posts.length - posts.indexOf(post);
      });
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
    .then(() => additionalResponse(state));
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
  watchedState.rssForm.state = '----------------start-----------------';
  const formData = new FormData(e.target);
  const rssUrl = formData.get('url');
  const errors = validate({ url: rssUrl }, state);
  watchedState.rssForm.valid = _.isEqual(errors, []);
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
    const viewedId = Number(event.target.dataset.id);
    watchedState.ui.viewedPosts.add(viewedId);
    watchedState.ui.currentModalId = viewedId;
  }
};
