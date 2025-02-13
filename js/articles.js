const articlesList = document.getElementById('articles-list');
const fileData = [];

async function fetchArticles() {
    try {
        const response = await fetch('https://danielcherney.com/articles/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(link => link.href.endsWith('.html'));

        for (const link of links) {
            const articleResponse = await fetch(link.href);
            const articleText = await articleResponse.text();
            const articleDoc = parser.parseFromString(articleText, 'text/html');
            const creationDate = articleDoc.querySelector('meta[name="creation-date"]');
            const titleElement = articleDoc.querySelector('title');

            if (creationDate && titleElement) {
                fileData.push({
                    creationDate: new Date(creationDate.content),
                    title: titleElement.textContent,
                    content: articleDoc.body.innerHTML,
                    url: link.href
                });
            }
        }
    } catch (error) {
        console.error('Failed to fetch articles:', error);
    }
}

function populateArticles() {
    fileData.sort((a, b) => b.creationDate - a.creationDate);

    if (fileData.length > 0) {
        fileData.forEach(article => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = article.url;
            a.textContent = `${article.title} (${article.creationDate.toDateString()})`;
            li.appendChild(a);
            articlesList.appendChild(li);
        });
    } else {
        articlesList.textContent = 'No articles found.';
    }
}

async function initialize() {
    await fetchArticles();
    populateArticles();
}

document.addEventListener('DOMContentLoaded', initialize);
