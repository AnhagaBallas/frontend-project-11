import axios from 'axios';

const buildUrl = (url) => {
  const allOriginsBase = 'https://allorigins.hexlet.app/get';
  const params = new URLSearchParams({
    disableCache: 'true',
    url,
  });
  return `${allOriginsBase}?${params.toString()}`;
};

const fetchFeed = (url) => axios
  .get(buildUrl(url))
  .then((response) => response.data.contents);

export default fetchFeed;
