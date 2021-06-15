import onChange from 'on-change';
import render from './render.js';

const state = {
  rssForm: {
    state: 'init',
    valid: '',
    current: '',
    added: [],
    validationErrors: [],
  },
};
const watchedState = onChange(state, () => {
  render(state);
});

export default watchedState;
