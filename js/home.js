async function fetchLatestArticle() {
    try {
        const response = await fetch('/articles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const articles = await response.json();
        
        if (articles.length > 0) {
            const latestArticle = articles[0];
            document.getElementById('latest-article-content').innerHTML = `
                <h3>${latestArticle.title}</h3>
                <p>${new Date(latestArticle.creationDate).toDateString()}</p>
                <p><a href="${latestArticle.url}">Read more</a></p>
            `;
        } else {
            document.getElementById('latest-article-content').textContent = 'No articles found.';
        }
    } catch (error) {
        console.error('Failed to fetch the latest article:', error);
        document.getElementById('latest-article-content').textContent = 'Failed to load the latest article.';
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestArticle);