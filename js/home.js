const latestArticleContent = document.getElementById('latest-article-content');
const fileData = [];

async function fetchLatestArticle() {
    try {
        // List objects in the articles directory
        const response = await fetch('https://danielcherney.com/articles/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Directory listing:', text); // Debugging statement
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a')).filter(link => link.href.endsWith('.html'));

        for (const link of links) {
            const url = link.href.startsWith('/') ? `https://danielcherney.com${link.getAttribute('href')}` : link.href;
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
        console.log('File data:', fileData); // Debugging statement
        fileData.sort((a, b) => b.creationDate - a.creationDate);

        if (fileData.length > 0) {
            const latestArticle = fileData[0];
            latestArticleContent.innerHTML = `
                <h3>${latestArticle.title}</h3>
                <p>${latestArticle.creationDate.toDateString()}</p>
                <div>${latestArticle.content}</div>
                <p><a href="${latestArticle.url}">Read more</a></p>
            `;
        } else {
            latestArticleContent.textContent = 'No articles found.';
        }
    } catch (error) {
        console.error('Failed to fetch the latest article:', error);
        latestArticleContent.textContent = 'Failed to load the latest article.';
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestArticle);
