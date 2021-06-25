import _ from 'lodash';

const parse = (rssXML) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(rssXML, 'text/xml');
  const feedId = Date.now();
  const items = parsedRSS.querySelectorAll('item');
  const links = Array.from(items).map((item) => {
    const title = item.querySelector('title').textContent;
    const link = _.trim(item.querySelector('link').nextSibling.textContent);
    const description = item.querySelector('description').textContent;
    const post = {
      feedId,
      title,
      description,
      link,
    };
    return post;
  });
  return {
    feed: {
      feedId,
      title: parsedRSS.querySelector('title').textContent,
      description: parsedRSS.querySelector('description').textContent,
    },
    posts: links,
  };
};

export default parse;
