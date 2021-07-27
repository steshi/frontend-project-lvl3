import i18n from 'i18next';
import { handlerForm, handlerLangButton } from './handlers.js';
import locales from './locales/locales.js';

const runApp = () => {
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
    });
  const rusButton = document.querySelector('#rusButton');
  console.log(11111111, rusButton);
  rusButton.addEventListener('click', () => {
    i18nInstance.changeLanguage('ru');
    handlerLangButton(state, i18nInstance);
  });
  const engButton = document.querySelector('#engButton');
  engButton.addEventListener('click', () => {
    i18nInstance.changeLanguage('en');
    handlerLangButton(state, i18nInstance);
  });
  const form = document.querySelector('form', '.rss-form');
  form.addEventListener('submit', (e) => handlerForm(state, i18nInstance, e));
};

export default runApp;
