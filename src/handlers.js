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
        const responseList = parse(response.data.contents);
        const newPosts = _.differenceBy(responseList.posts, state.data.posts, 'title');
        state.rssForm.state = 'start';
        const posts = [...newPosts, ...state.data.posts];
        posts.forEach((post) => {
          post.id = posts.length - posts.indexOf(post);
        });
        const newUiStates = newPosts.map(({ id }) => ({ postId: id, viewed: false }));
        state.stateUi = [...newUiStates, ...state.stateUi];
        state.data.posts = posts;
      });
  });
  setTimeout(() => additionalResponse(state), 5000);
};

const makeResponse = (state, link) => {
  getRSS(link)
    .then((response) => {
      const responseList = parse(response.data.contents);
      const posts = [...responseList.posts, ...state.data.posts];
      posts.forEach((post) => {
        post.id = posts.length - posts.indexOf(post);
      });
      const newUiStates = responseList.posts.map(({ id }) => ({ postId: id, viewed: false }));
      state.stateUi = [...newUiStates, ...state.stateUi];
      state.data.posts = posts;
      state.data.feeds = [responseList.feed, ...state.data.feeds];
      state.rssForm.alreadyAddedRsss.push(link);
      state.rssForm.feedback = 'success';
      state.rssForm.state = 'successfully responsed';
      console.log(222222222222, 'sucess');
    })
    .catch((error) => {
      console.log(3333333333, error);
      console.log(4444, error.message, 555, error.name, 666, error.message === 'Network Error');
      state.rssForm.feedback = (error.message === 'Network Error') ? 'errors.networkError' : 'errors.noValidRss';
      state.rssForm.state = 'bad responsed';
    })
    .then(() => additionalResponse(state));
};

export const handlerForm = (state, i18nInstance, event) => {
  const watchedState = visualize(state, i18nInstance);
  event.preventDefault();
  watchedState.rssForm.state = '----------------start-----------------';
  const formData = new FormData(event.target);
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
