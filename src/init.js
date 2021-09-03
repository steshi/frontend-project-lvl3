import i18n from 'i18next';
import { handlerClick, handlerForm, handlerLangButton } from './handlers.js';
import locales from './locales/locales.js';
import visualize from './view.js';

export default () => {
  const state = {
    lang: 'ru',
    data: {
      posts: [],
      feeds: [],
    },
    ui: {
      currentModalId: '',
      viewedPosts: new Set(),
    },
    rssForm: {
      feedback: '',
      state: 'init',
      valid: false,
      alreadyAddedRsss: [],
    },
  };
  const i18nInstance = i18n.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources: locales,
    })
    .then(() => {
      const elements = {
        feedback: document.querySelector('.feedback'),
        input: document.querySelector('#url-input'),
        form: document.querySelector('form'),
        addButton: document.querySelector('[aria-label="add"]'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
        modal: document.querySelector('#detailModal'),
      };
      const watchedState = visualize(state, i18nInstance, elements);
      document.querySelector('.langButtons').addEventListener('click', (event) => {
        handlerLangButton(watchedState, event, i18nInstance);
      });
      document.querySelector('form', '.rss-form').addEventListener('submit', (event) => {
        event.preventDefault();
        handlerForm(watchedState, event);
      });
      elements.posts.addEventListener('click', (event) => {
        handlerClick(watchedState, event);
      });
    });
};
