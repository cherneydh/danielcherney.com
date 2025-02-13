document.addEventListener('DOMContentLoaded', async () => {
    const articlesList = document.getElementById('articles-list');

    async function fetchArticles() {
        try {
            const response = await fetch('https://danielcherney.com/articles/articles.json'); // Ensure this URL is correct
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const articles = await response.json();
            console.log('Fetched articles:', articles); // Debugging statement
            return articles.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            return [];
        }
    }

    function createArticleBox(article) {
        const articleBox = document.createElement('div');
        articleBox.classList.add('article-box');

        const articleLink = document.createElement('a');
        articleLink.href = `https://danielcherney.com${article.url}`;
        articleLink.innerHTML = `
            <img src="${article.imageUrl || 'https://danielcherney.com/default-article-image.jpg'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${new Date(article.creationDate).toDateString()}</p>
        `;
        
        articleBox.appendChild(articleLink);
        return articleBox;
    }

    function populateArticles(articles) {
        if (articles.length === 0) {
            articlesList.textContent = 'No articles found.';
            return;
        }

        articles.forEach(article => {
            const articleBox = createArticleBox(article);
            articlesList.appendChild(articleBox);
        });
    }

    const articles = await fetchArticles();
    populateArticles(articles);
});