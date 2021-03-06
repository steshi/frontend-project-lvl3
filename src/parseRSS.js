import _ from 'lodash';

const parserError = (message) => {
  const error = new Error(message);
  error.name = 'ParserError';
  return error;
};

const parse = (rssXML) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(rssXML, 'text/xml');
  const error = parsedRSS.querySelector('parsererror');
  if (error) {
    throw parserError(error.textContent);
  }
  return parsedRSS;
};

const normalize = (rssXML) => {
  const parsedRSS = parse(rssXML);
  const items = parsedRSS.querySelectorAll('item');
  const feedTittle = parsedRSS.querySelector('title').textContent;
  const links = Array.from(items).map((item) => {
    const title = item.querySelector('title').textContent;
    const link = _.trim(item.querySelector('link').textContent);
    const description = item.querySelector('description').textContent;
    const post = {
      feedTittle,
      title,
      description,
      link,
    };
    return post;
  });
  return {
    feed: {
      title: feedTittle,
      description: parsedRSS.querySelector('description').textContent,
    },
    posts: links,
  };
};

export default normalize;
