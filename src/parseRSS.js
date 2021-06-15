import _ from 'lodash';

const parse = (rssXML) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(rssXML.data, 'text/html');
  const temp = document.createElement('div');
  temp.innerHTML = parsedRSS.body.innerHTML;
  const items = temp.querySelectorAll('item');
  const links = Array.from(items).map((item) => {
    const title = item.querySelector('title').innerText;
    const link = _.trim(item.querySelector('link').nextSibling.textContent);
    const description = item.querySelector('description').innerText;
    const result = [title, description, link];
    return result;
  });
  const feedsD = [temp.querySelector('title').textContent, temp.querySelector('description').textContent];
  return {
    feeds: feedsD,
    posts: links,
  };
};

export default parse;
