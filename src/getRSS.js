import axios from 'axios';

const getRSS = (url) => {
  console.log(33333333333, 'sending response', url);
  return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`);
};

export default getRSS;
