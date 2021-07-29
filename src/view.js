/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderModal = (state, event, i18nInstance) => {
  const postLi = event.target.parentNode;
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
        <a href="${post.link}" target="blank"><button type="button" class="btn btn-primary">${i18nInstance.t('modal.details')}</button></a>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18nInstance.t('modal.close')}</button>
        </div>
      </div>
    </div>`;
};

const viewedOrNotClass = (state, id) => {
  const filtered = state.stateUi.filter((element) => element.postId === id);
  return filtered[0].viewed ? 'fw-normal' : 'fw-bold';
};

const renderData = (state, i18nInstance) => {
  console.log('----------', 'renderDATA');
  if (state.data.feeds.length > 0) {
    const posts = document.querySelector('.posts');
    posts.innerHTML = `<div class="card-body posts-container"><h2 class="card-title h4">${i18nInstance.t('posts')}</h2></div><ul class="list-group border-0 rounded-0 postsList"></ul>`;
    const postsHTML = state.data.posts
      .map((post) => `<li id="${post.id}" class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="${viewedOrNotClass(state, post.id)}" target="_blank" rel="noopener noreferrer">${post.title}</a>
        <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#detailModal">
        ${i18nInstance.t('modal.show')}
      </button></li>`)
      .join('');
    posts.querySelector('.postsList').innerHTML = postsHTML;
    const buttons = posts.querySelectorAll('button');
    buttons.forEach((button) => button.addEventListener('click', (event) => {
      renderModal(state, event, i18nInstance);
    }));
    const links = posts.querySelectorAll('a');
    links.forEach((link) => link.addEventListener('click', (event) => {
      const liId = parseInt(event.target.parentElement.id, 10);
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

const renderFormSuccess = (state, i18nInstance, elements) => {
  console.log('----------', 'renderFORMSucess');
  elements.addButton.disabled = false;
  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18nInstance.t(state.rssForm.feedback);
  elements.form.reset();
  elements.input.focus();
};

const renderFormFail = (state, i18nInstance, elements) => {
  console.log('----------', 'renderFormFail');
  elements.addButton.disabled = false;
  if (elements.feedback.classList.contains('text-success')) {
    elements.feedback.classList.replace('text-success', 'text-danger');
  }
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = i18nInstance.t(state.rssForm.feedback);
};

const renderFormPending = (elements) => {
  console.log('----------', 'renderPending');
  elements.addButton.disabled = true;
};

const render = (state, i18nInstance) => {
  console.log('----------', 'render');

  const elements = {
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('#url-input'),
    form: document.querySelector('form'),
    addButton: document.querySelector('[aria-label="add"]'),
  };
  switch (state.rssForm.state) {
    case 'pending':
      renderFormPending(elements);
      break;
    case 'failed':
      renderFormFail(state, i18nInstance, elements);
      break;
    case 'bad responsed':
      renderFormFail(state, i18nInstance, elements);
      break;
    case 'successfully responsed':
      renderFormSuccess(state, i18nInstance, elements);
      renderData(state, i18nInstance);
      break;
    default:
      elements.feedback.textContent = (elements.feedback.innerText === '') ? '' : i18nInstance.t(state.rssForm.feedback);
      renderData(state, i18nInstance);
      break;
  }
};

const visualize = (state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    console.log('RENDERING STATE', '\n', 'PATH:', path, '\n', 'VALUE', value);
    render(state, i18nInstance);
  });
  return watchedState;
};

export default visualize;
