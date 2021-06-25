import onChange from 'on-change';
import render from './render.js';

const state = {
  data: [],
  rssForm: {
    state: 'init',
    valid: '',
    addedList: [],
    errors: [],
  },
};
const watchedState = onChange(state, (path, value) => {
  console.log(55555, state, 55555, 'RENDERING STATE', path, 4444, value);
  render(state);
});

export default watchedState;
