const apiKey = 'cfa5d07720e44c57987da1aebfb1a8a3';
const main = document.querySelector('main');
const defaultSource = 'abc-news';
const sourceSelector = document.querySelector('#sources');

window.addEventListener('load', async e => {
  updateNews();
  await updateSources();
  sourceSelector.value = defaultSource;

  sourceSelector.addEventListener('change', e => {
    updateNews(e.target.value);
  });

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log('service worker registered');
    } catch (error) {
      console.log('service worker registratio failed');
    }
  }
});

async function updateSources() {
  const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await res.json();
  sourceSelector.innerHTML = json.sources
    .map(src => `<option value="${src.id}">${src.name}</option>`)
    .join('\n');
}

async function updateNews(source = defaultSource) {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`
  );

  const json = await res.json();
  main.innerHTML = json.articles.map(createAticles).join('\n');
}

function createAticles(article) {
  return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}
