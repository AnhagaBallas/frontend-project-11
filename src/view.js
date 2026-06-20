import { subscribe } from 'valtio/vanilla';
import { Modal } from 'bootstrap';

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

const renderForm = (status, els) => {
  switch (status) {
    case 'loading':
      els.input.setAttribute('readonly', true);
      els.button.setAttribute('disabled', true);
      break;
    case 'idle':
    default:
      els.input.removeAttribute('readonly');
      els.button.removeAttribute('disabled');
      break;
  }
};

const renderFeedback = ({ error, status, feedsCount }, els, i18n) => {
  if (error) {
    els.input.classList.add('is-invalid');
    els.feedback.classList.remove('text-success');
    els.feedback.classList.add('text-danger');
    els.feedback.textContent = i18n.t(error);
    return;
  }

  els.input.classList.remove('is-invalid');
  els.feedback.classList.remove('text-danger');

  if (status === 'idle' && feedsCount > 0) {
    els.feedback.classList.add('text-success');
    els.feedback.textContent = i18n.t('messages.success');
    els.form.reset();
    els.input.focus();
  }
};

const renderFeeds = (feeds, els, i18n) => {
  els.feedsContainer.innerHTML = '';

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
  els.feedsContainer.append(card);
};

const renderPosts = (posts, readPostIds, els, i18n) => {
  els.postsContainer.innerHTML = '';

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
    link.dataset.id = post.id;
    link.textContent = post.title;
    link.classList.add(readPostIds.has(post.id) ? 'fw-normal' : 'fw-bold');

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
  els.postsContainer.append(card);
};

const renderModal = (post, els, i18n) => {
  els.modal.title.textContent = post.title;
  els.modal.body.textContent = post.description;
  els.modal.readLink.href = post.link;
  els.modal.readLink.textContent = i18n.t('ui.modal.read');
  els.modal.closeBtn.textContent = i18n.t('ui.modal.close');
};

// ─── Init ───────────────────────────────────────────────────

const initView = (state, i18n) => {
  const els = {
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

  // Bootstrap Modal экземпляр — локальный, не глобальный
  const modalInstance = new Modal(els.modal.window);

  // Клик по кнопке «Просмотр»
  els.postsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;

    const postId = Number(btn.dataset.id);
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    // Помечаем как прочитанный
    state.ui.readPostIds.add(postId);

    // Обновляем только эту ссылку — без полного перерендера
    const link = els.postsContainer.querySelector(`a[data-id="${postId}"]`);
    if (link) {
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal');
    }

    renderModal(post, els, i18n);
    modalInstance.show();
  });

  // Реактивность через Valtio
  subscribe(state, () => {
    renderForm(state.form.status, els);
    renderFeedback(
      { error: state.form.error, status: state.form.status, feedsCount: state.feeds.length },
      els,
      i18n,
    );

    if (state.feeds.length > 0) {
      renderFeeds(state.feeds, els, i18n);
    }

    if (state.posts.length > 0) {
      renderPosts(state.posts, state.ui.readPostIds, els, i18n);
    }
  });
};

export default initView;
