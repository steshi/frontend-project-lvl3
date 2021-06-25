import _ from 'lodash';

const parse = (rssXML) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(rssXML, 'text/html');
  const items = parsedRSS.querySelectorAll('item');
  const links = Array.from(items).map((item) => {
    const title = item.querySelector('title').innerText;
    const link = _.trim(item.querySelector('link').nextSibling.textContent);
    const description = item.querySelector('description').innerText;
    const post = {
      title,
      description,
      link,
    };
    return post;
  });
  return {
    feedsTitle: parsedRSS.querySelector('title').textContent,
    feedsDescription: parsedRSS.querySelector('description').textContent,
    posts: links,
  };
};

export default parse;
