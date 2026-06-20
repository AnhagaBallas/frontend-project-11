const parse = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const error = new Error('errors.parse');
    error.isParseError = true;
    throw error;
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    const error = new Error('errors.parse');
    error.isParseError = true;
    throw error;
  }

  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const items = [...channel.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description')?.textContent ?? '',
  }));

  return { title, description, items };
};

export default parse;
