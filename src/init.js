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
    })
    .then((t) => {
      // document.querySelector('#rusButton').addEventListener('click', () => {
      //   t.changeLanguage('ru');
      //   handlerLangButton(state, t);
      // });
      // document.querySelector('#engButton').addEventListener('click', () => {
      //   t.changeLanguage('en');
      //   handlerLangButton(state, t);
      // });
      document.querySelector('form', '.rss-form').addEventListener('submit', (e) => handlerForm(state, t, e));
    });
};

export default runApp;
