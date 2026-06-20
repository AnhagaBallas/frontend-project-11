import { subscribe } from 'valtio/vanilla';
import { Modal } from 'bootstrap';

const elements = {
  form: document.querySelector('#rss-form'),
  input: document.querySelector('#rss-input'),
  feedback: document.querySelector('#feedback'),
  button: document.querySelector('[type="submit"]'),
  feedsContainer: document.querySelector('#feeds'),
  postsContainer: document.querySelector('#posts'),
  modal: {
    window: document.querySelector('#modal'),
    title: document.querySelector('#modalTitle'),
    body: document.querySelector('#modalBody'),
    readLink: document.querySelector('#modalReadLink'),
    closeBtn: document.querySelector('#modalClose'),
  },
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

  cardBody.append(list);
  card.append(list);
  feedsContainer.append(card);
};

const renderPosts = (posts, readPostIds, i18n) => {
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

    // Ссылка — жирная если не читали, обычная если читали
    const link = document.createElement('a');
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.id = post.id;
    link.textContent = post.title;
    link.classList.add(readPostIds.has(post.id) ? 'fw-normal' : 'fw-bold');

    // Кнопка предпросмотра
    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'flex-shrink-0', 'ms-2');
    previewBtn.dataset.id = post.id;
    previewBtn.dataset.bsToggle = 'modal';
    previewBtn.dataset.bsTarget = '#modal';
    previewBtn.textContent = i18n.t('ui.preview');

    item.append(link, previewBtn);
    list.append(item);
  });

  cardBody.append(list);
  card.append(list);
  postsContainer.append(card);
};

const renderModal = (post, i18n) => {
  const { modal } = elements;

  modal.title.textContent = post.title;
  modal.body.textContent = post.description;
  modal.readLink.href = post.link;
  modal.readLink.textContent = i18n.t('ui.modal.read');
  modal.closeBtn.textContent = i18n.t('ui.modal.close');
};

const renderReadPost = (postId) => {
  const link = elements.postsContainer.querySelector(`a[data-id="${postId}"]`);
  if (link) {
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal');
  }
};

// ─── Init ───────────────────────────────────────────────────

const initView = (state, i18n) => {
  const modal = new Modal(elements.modal.window);

  // Клик по кнопке предпросмотра
  elements.postsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;

    const postId = Number(btn.dataset.id);
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    // Помечаем как прочитанный
    state.ui.readPostIds.add(postId);
    renderReadPost(postId);

    // Показываем модалку
    renderModal(post, i18n);
    modal.show();
  });

  // Подписка на изменения состояния
  subscribe(state, () => {
    renderFeeds(state.feeds, i18n);
    renderPosts(state.posts, state.ui.readPostIds, i18n);

    if (state.form.error) {
      renderFeedback(state.form.error, i18n);
      return;
    }

    renderForm(state);

    if (state.form.status === 'idle' && state.feeds.length > 0) {
      renderSuccess(i18n);
    }
  });
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

export default initView;
