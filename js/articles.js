document.addEventListener('DOMContentLoaded', async () => {
    const articlesList = document.getElementById('articles-list');
    articlesList.style.display = 'flex';
    articlesList.style.flexWrap = 'wrap';

    async function fetchArticles() {
        try {
            const response = await fetch('https://danielcherney.com/articles.json'); // Ensure this URL is correct
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
        articleBox.style.border = '1px solid #ddd';
        articleBox.style.borderRadius = '8px';
        articleBox.style.margin = '10px';
        articleBox.style.padding = '10px';
        articleBox.style.width = 'calc(33% - 20px)';
        articleBox.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';
        articleBox.style.textAlign = 'center';

        const articleImage = document.createElement('img');
        articleImage.src = article.imageUrl || 'https://danielcherney.com/default-article-image.jpg'; // Placeholder image
        articleImage.alt = article.title;
        articleImage.style.width = '100%';
        articleImage.style.borderRadius = '8px 8px 0 0';

        const articleTitle = document.createElement('h3');
        articleTitle.textContent = article.title;

        const articleDate = document.createElement('p');
        articleDate.textContent = new Date(article.creationDate).toDateString();

        const articleLink = document.createElement('a');
        articleLink.href = `https://danielcherney.com${article.url}`;
        articleLink.textContent = 'Read more';
        articleLink.style.display = 'block';
        articleLink.style.marginTop = '10px';
        articleLink.style.textDecoration = 'none';
        articleLink.style.color = '#008CBA';

        articleBox.appendChild(articleImage);
        articleBox.appendChild(articleTitle);
        articleBox.appendChild(articleDate);
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
