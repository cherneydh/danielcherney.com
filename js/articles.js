const articlesList = document.getElementById('articles-list');
const fileData = [];

async function fetchArticles() {
    try {
        const response = await fetch('https://danielcherney.com.s3.amazonaws.com/?list-type=2&prefix=articles/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Directory listing:', text); // Debugging statement
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'application/xml');
        const keys = doc.getElementsByTagName('Key');

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i].textContent;
            if (key.endsWith('.html') && key.startsWith('articles/')) {
                const url = `https://danielcherney.com.s3.amazonaws.com/${key}`;
                console.log('Fetching article:', url); // Debugging statement
                const articleResponse = await fetch(url);
                const articleText = await articleResponse.text();
                const articleDoc = parser.parseFromString(articleText, 'text/html');
                const creationDate = articleDoc.querySelector('meta[name="creation-date"]');
                const titleElement = articleDoc.querySelector('title');

                if (creationDate && titleElement) {
                    fileData.push({
                        creationDate: new Date(creationDate.content),
                        title: titleElement.textContent,
                        content: articleDoc.body.innerHTML,
                        url: url
                    });
                }
            }
        }
        console.log('File data:', fileData); // Debugging statement
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
