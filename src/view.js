import { subscribe } from 'valtio/vanilla';

const elements = {
  form: document.querySelector('#rss-form'),
  input: document.querySelector('#rss-input'),
  feedback: document.querySelector('#feedback'),
  button: document.querySelector('[type="submit"]'),
  feedsContainer: document.querySelector('#feeds'),
  postsContainer: document.querySelector('#posts'),
};

// ─── Helpers ────────────────────────────────────────────────

const createCard = (title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = title;

  cardBody.append(cardTitle);
  card.append(cardBody);
  return { card, cardBody };
};

// ─── Renders ────────────────────────────────────────────────

const renderFeedback = (errorCode, i18n) => {
  const { input, feedback } = elements;

  if (errorCode) {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18n.t(errorCode);
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
  }
};

const renderSuccess = (i18n) => {
  const { input, feedback, form } = elements;

  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('messages.success');

  form.reset();
  input.focus();
};

const renderFeeds = (feeds, i18n) => {
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';

  const { card, cardBody } = createCard(i18n.t('ui.feeds'));

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'border-end-0');

    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;

    item.append(title, description);
    list.append(item);
  });

  card.append(list);
  cardBody.append(list);
  feedsContainer.append(card);
};

const renderPosts = (posts, i18n) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';

  const { card, cardBody } = createCard(i18n.t('ui.posts'));

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const link = document.createElement('a');
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('fw-bold');
    link.textContent = post.title;
    link.dataset.id = post.id;

    item.append(link);
    list.append(item);
  });

  card.append(list);
  cardBody.append(list);
  postsContainer.append(card);
};

const renderForm = (state) => {
  const { input, button } = elements;

  switch (state.form.status) {
    case 'loading':
      input.setAttribute('readonly', true);
      button.setAttribute('disabled', true);
      break;

    case 'idle':
    default:
      input.removeAttribute('readonly');
      button.removeAttribute('disabled');
      break;
  }
};

// ─── Init ───────────────────────────────────────────────────

const initView = (state, i18n) => {
  subscribe(state, () => {
    renderForm(state);

    if (state.form.error) {
      renderFeedback(state.form.error, i18n);
      return;
    }

    if (state.form.status === 'idle' && state.feeds.length > 0) {
      renderSuccess(i18n);
    }

    if (state.feeds.length > 0) {
      renderFeeds(state.feeds, i18n);
    }

    if (state.posts.length > 0) {
      renderPosts(state.posts, i18n);
    }
  });
};

export default initView;
