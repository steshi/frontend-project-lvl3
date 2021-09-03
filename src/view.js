/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderModal = (state, i18nInstance, elements) => {
  const { modal } = elements;
  const post = state.data.posts.filter((el) => el.id === state.ui.currentModalId)[0];
  modal.querySelector('#detailModalTitle').innerText = post.title;
  modal.querySelector('.modal-body').textContent = post.description;
  const showMoreButton = modal.querySelector('.btn-primary');
  showMoreButton.innerText = i18nInstance.t('details');
  showMoreButton.href = post.link;
  modal.querySelector('.btn-secondary').innerText = i18nInstance.t('close');
};

const viewedOrNotClass = (state, id) => (state.ui.viewedPosts.has(id) ? 'fw-normal' : 'fw-bold');

const renderPosts = (state, i18nInstance, elements) => {
  const { posts } = elements;
  posts.innerHTML = '<div class="card-body posts-container"><h2 class="card-title h4"></h2></div><ul class="list-group border-0 rounded-0 postsList"></ul>';
  posts.querySelector('h2').textContent = i18nInstance.t('posts');
  const postsList = posts.querySelector('.postsList');
  state.data.posts
    .forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      li.innerHTML = `<a data-id="${post.id}" target="_blank" rel="noopener noreferrer"></a>
      <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#detailModal" data-id="${post.id}">
      </button>`;
      const a = li.querySelector('a');
      a.href = post.link;
      a.classList.add(viewedOrNotClass(state, post.id));
      a.textContent = post.title;
      li.querySelector('button').textContent = i18nInstance.t('show');
      postsList.append(li);
    });
};

const renderFeeds = (state, i18nInstance, elements) => {
  const { feeds } = elements;
  feeds.innerHTML = '<div class="card-body feeds-contatiner"><h2 class="card-title h4"></h2></div><ul class="list-group border-0 rounded-0 feedsList"></ul>';
  feeds.querySelector('h2').textContent = i18nInstance.t('feeds');
  const feedsList = feeds.querySelector('.feedsList');
  state.data.feeds.forEach((feed) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    li.append(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(p);
    feedsList.append(li);
  });
};

const renderData = (state, i18nInstance, elements) => {
  if (state.data.feeds.length > 0) {
    renderPosts(state, i18nInstance, elements);
    renderFeeds(state, i18nInstance, elements);
  }
};

const renderFormSuccess = (state, i18nInstance, elements) => {
  elements.addButton.disabled = false;
  elements.input.readOnly = false;
  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18nInstance.t(state.rssForm.feedback);
  elements.form.reset();
  elements.input.focus();
};

const renderFormFail = (state, i18nInstance, elements) => {
  elements.addButton.disabled = false;
  elements.input.readOnly = false;
  if (elements.feedback.classList.contains('text-success')) {
    elements.feedback.classList.replace('text-success', 'text-danger');
  }
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = i18nInstance.t(state.rssForm.feedback);
};

const renderFormPending = (elements) => {
  elements.addButton.disabled = true;
  elements.input.readOnly = true;
};

const render = (state, i18nInstance, elements) => {
  switch (state.rssForm.state) {
    case 'pending':
      renderFormPending(elements);
      break;
    case 'failed':
      renderFormFail(state, i18nInstance, elements);
      break;
    case 'successfully responsed':
      renderFormSuccess(state, i18nInstance, elements);
      renderData(state, i18nInstance, elements);
      break;
    default:
      elements.feedback.textContent = (elements.feedback.textContent === '') ? '' : i18nInstance.t(state.rssForm.feedback);
      renderData(state, i18nInstance, elements);
      break;
  }
};

const visualize = (state, i18nInstance, elements) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'rssForm.state' || path === 'lang' || path === 'ui.viewedPosts') {
      render(state, i18nInstance, elements);
    } else if (path === 'ui.currentModalId') {
      renderModal(state, i18nInstance, elements);
    }
  });
  return watchedState;
};

export default visualize;
