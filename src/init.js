import i18n from 'i18next';
import { handlerForm, handlerLangButton } from './handlers.js';
import locales from './locales/locales.js';

export default () => {
  const state = {
    lang: 'ru',
    data: {
      posts: [],
      feeds: [],
    },
    stateUi: [],
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
      debug: true,
      resources: locales,
    })
    .then(() => {
      document.querySelectorAll('.langButton')
        .forEach((button) => {
          const { lang } = button.dataset;
          button.addEventListener('click', () => {
            i18nInstance.changeLanguage(lang);
            handlerLangButton(state, i18nInstance);
          });
        });
      document.querySelector('form', '.rss-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log(1111111111111, 'button submit pressed', data);
        handlerForm(state, i18nInstance, event);
      });
    });
};
