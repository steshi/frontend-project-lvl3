import axios from 'axios';

const getRSS = (url) => axios(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`);

export default getRSS;
