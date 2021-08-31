import i18n from 'i18next';
import { handlerClick, handlerForm, handlerLangButton } from './handlers.js';
import locales from './locales/locales.js';

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
      document.querySelector('.langButtons').addEventListener('click', (event) => {
        handlerLangButton(state, i18nInstance, event, elements);
      });
      document.querySelector('form', '.rss-form').addEventListener('submit', (event) => {
        event.preventDefault();
        handlerForm(state, i18nInstance, event, elements);
      });
      elements.posts.addEventListener('click', (event) => {
        handlerClick(state, i18nInstance, event, elements);
      });
    });
};
