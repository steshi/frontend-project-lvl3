/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderModal = (state, e, i18nInstance) => {
  const postLi = e.target.parentNode;
  const liId = Number.parseInt(postLi.id, 10);
  state.stateUi.forEach((linkState) => {
    if (linkState.postId === liId) {
      linkState.viewed = true;
    }
  });
  const modal = document.querySelector('#detailModal');
  const post = state.data.posts.filter((el) => el.id === liId)[0];
  modal.innerHTML = `<div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detailModalLabel">${post.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        ${post.description}
        </div>
        <div class="modal-footer">
        <a href="${post.link}" target="blank"><button type="button" class="btn btn-primary">${i18nInstance.t('details')}</button></a>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18nInstance.t('close')}</button>
        </div>
      </div>
    </div>`;
};

const viewedOrNotClass = (state, id) => {
  const filtered = state.stateUi.filter((element) => element.postId === id);
  return filtered[0].viewed ? 'fw-normal' : 'fw-bold';
};

const renderData = (state, i18nInstance) => {
  if (state.data.feeds.length > 0) {
    const posts = document.querySelector('.posts');
    posts.innerHTML = `<div class="card-body posts-container"><h2 class="card-title h4">${i18nInstance.t('posts')}</h2></div><ul class="list-group border-0 rounded-0 postsList"></ul>`;
    const postsHTML = state.data.posts
      .map((post) => `<li id="${post.id}" class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="${viewedOrNotClass(state, post.id)}" target="_blank" rel="noopener noreferrer">${post.title}</a>
        <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#detailModal">
        ${i18nInstance.t('show')}
      </button></li>`)
      .join('');
    posts.querySelector('.postsList').innerHTML = postsHTML;
    const buttons = posts.querySelectorAll('button');
    buttons.forEach((button) => button.addEventListener('click', (e) => {
      renderModal(state, e, i18nInstance);
    }));
    const links = posts.querySelectorAll('a');
    links.forEach((link) => link.addEventListener('click', (e) => {
      const liId = parseInt(e.target.parentElement.id, 10);
      state.stateUi.forEach((linkState) => {
        if (linkState.postId === liId) {
          linkState.viewed = true;
        }
      });
    }));

    const feeds = document.querySelector('.feeds');
    feeds.innerHTML = `<div class="card-body feeds-contatiner"><h2 class="card-title h4">${i18nInstance.t('feeds')}</h2></div><ul class="list-group border-0 rounded-0 feedsList"></ul>`;
    const feedsHTML = state.data.feeds
      .map((feed) => `<li><h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p></li>`)
      .join('');
    feeds.querySelector('.feedsList').innerHTML = feedsHTML;
  }
};

const feedback = document.querySelector('.feedback');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
const addButton = document.querySelector('.btn-primary');

const renderSuccess = (state, i18nInstance) => {
  addButton.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.innerText = i18nInstance.t(state.rssForm.feedback);
  form.reset();
  input.focus();
};

const renderFail = (state, i18nInstance) => {
  addButton.disabled = false;
  if (feedback.classList.contains('text-success')) {
    feedback.classList.replace('text-success', 'text-danger');
  }
  input.classList.add('is-invalid');
  feedback.innerText = i18nInstance.t(state.rssForm.feedback);
};

const renderPending = () => {
  addButton.disabled = true;
};
const render = (state, i18nInstance) => {
  switch (state.rssForm.state) {
    case 'pending':
      renderPending();
      break;
    case 'failed':
      renderFail(state, i18nInstance);
      break;
    case 'bad responsed':
      renderFail(state, i18nInstance);
      break;
    case 'successfully responsed':
      renderSuccess(state, i18nInstance);
      renderData(state, i18nInstance);
      break;
    default:
      renderData(state, i18nInstance);
      break;
  }
};

const visualize = (state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    console.log('RENDERING STATE', '\n', 'PATH:', path, '\n', 'VALUE', value);
    render(state, i18nInstance);
    if (path === 'lang') renderData(state, i18nInstance);
  });
  return watchedState;
};

export default visualize;
