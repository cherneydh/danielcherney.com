const folder = window.location.pathname.split('/').pop().split('.')[0];
const latestArticleContent = document.getElementById('latest-article-content');

async function fetchLatestArticle() {
    try {
        const response = await fetch(`https://danielcherney.com.s3.amazonaws.com/${folder}/index.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const articles = Array.from(doc.querySelectorAll('meta[name="creation-date"]')).map(meta => ({
            creationDate: new Date(meta.content),
            title: meta.nextElementSibling ? meta.nextElementSibling.textContent : '',
            content: meta.parentElement ? meta.parentElement.innerHTML : ''
        }));
        articles.sort((a, b) => b.creationDate - a.creationDate);

        if (articles.length > 0) {
            latestArticleContent.innerHTML = articles[0].content;
        } else {
            latestArticleContent.textContent = 'No articles found.';
        }
    } catch (error) {
        console.error('Failed to fetch the latest article:', error);
        latestArticleContent.textContent = 'Failed to load the latest article.';
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestArticle);
