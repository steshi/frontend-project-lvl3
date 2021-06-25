const renderData = (state) => {
  console.log('xxx', state.data);
  const posts = document.querySelector('.posts');
  posts.innerHTML = '<div class="card-body posts-container"><h2 class="card-title h4">Posts</h2></div><ul class="list-group border-0 rounded-0 postsList"></ul>';
  const postsHTML = state.data
    .map((rss) => rss.posts
      .map((post) => `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${post.title}</a></li>`)
      .join(''))
    .join('');
  posts.querySelector('.postsList').innerHTML = postsHTML;

  const feeds = document.querySelector('.feeds');
  feeds.innerHTML = '<div class="card-body feeds-contatiner"><h2 class="card-title h4">Feeds</h2></div><ul class="list-group border-0 rounded-0 feedsList"></ul>';
  const feedsHTML = state.data
    .map((rss) => `<li><h3 class="h6 m-0">${rss.feed.title}</h3><p class="m-0 small text-black-50">${rss.feed.description}</p></li>`)
    .join('');
  feeds.querySelector('.feedsList').innerHTML = feedsHTML;
};

const render = (state) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('form');
  const badFeedback = () => {
    if (feedback.classList.contains('text-success')) {
      feedback.classList.replace('text-success', 'text-danger');
    }
    input.classList.add('is-invalid');
    [feedback.innerText] = state.rssForm.errors;
  };
  const successFeedback = () => {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.innerText = 'RSS successfully loaded';
    form.reset();
    input.focus();
  };
  if (state.rssForm.valid === false || state.rssForm.state === 'bad responsed') {
    badFeedback();
  }
  if (state.rssForm.valid && state.rssForm.state === 'successfully responsed') {
    successFeedback();
    renderData(state);
  }
};

export default render;
