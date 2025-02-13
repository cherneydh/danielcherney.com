document.addEventListener('DOMContentLoaded', async () => {
    const articlesList = document.getElementById('articles-list');

    async function fetchArticles() {
        try {
            const response = await fetch('https://danielcherney.com/articles/articles.json'); // Ensure this URL is correct
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const articles = await response.json();
            return articles.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            return [];
        }
    }

    function populateArticles(articles) {
        if (articles.length === 0) {
            articlesList.textContent = 'No articles found.';
            return;
        }

        articles.forEach(article => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = article.url;
            a.textContent = `${article.title} (${new Date(article.creationDate).toDateString()})`;
            li.appendChild(a);
            articlesList.appendChild(li);
        });
    }

    const articles = await fetchArticles();
    populateArticles(articles);
});
