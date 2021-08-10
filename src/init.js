import i18n from 'i18next';
import { handlerForm, handlerLangButton, handleClickPost } from './handlers.js';
import locales from './locales/locales.js';

export default () => {
  const state = {
    lang: 'ru',
    data: {
      posts: [],
      feeds: [],
    },
    ui: {
      viewedPosts: [],
    },
    viewedPosts: [],
    rssForm: {
      feedback: '',
      state: 'init',
      valid: '',
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

      };
      document.querySelectorAll('.langButton')
        .forEach((button) => {
          const { lang } = button.dataset;
          button.addEventListener('click', () => {
            i18nInstance.changeLanguage(lang);
            handlerLangButton(state, i18nInstance, elements);
          });
        });
      document.querySelector('form', '.rss-form').addEventListener('submit', (event) => {
        event.preventDefault();
        handlerForm(state, i18nInstance, event, elements);
      });
      elements.posts.addEventListener('click', (event) => {
        handleClickPost(event);
      });
    });
};
