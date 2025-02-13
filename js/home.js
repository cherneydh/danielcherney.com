const subdirectories = ['games', 'musings', 'records'];
const fileData = [];

async function fetchFiles(subdirectory) {
    try {
        const response = await fetch(`https://danielcherney.com.s3.amazonaws.com/${subdirectory}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = doc.querySelectorAll('a');
        
        for (const link of links) {
            if (link.href.endsWith('.html')) {
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
                        subdirectory
                    });
                }
            }
        }
    } catch (error) {
        console.error(`Failed to fetch files from ${subdirectory}:`, error);
    }
}

function populateList() {
    const latestArticleContent = document.getElementById('latest-article-content');
    fileData.sort((a, b) => b.creationDate - a.creationDate);

    if (fileData.length > 0) {
        const latestArticle = fileData[0];
        latestArticleContent.innerHTML = `
            <h3>${latestArticle.title}</h3>
            <p>${latestArticle.creationDate.toDateString()}</p>
            <div>${latestArticle.content}</div>
            <p>From: ${latestArticle.subdirectory}</p>
        `;
    } else {
        latestArticleContent.textContent = 'No articles found.';
    }
}

async function initialize() {
    const fetchPromises = subdirectories.map(fetchFiles);
    await Promise.all(fetchPromises);
    populateList();
}

document.addEventListener('DOMContentLoaded', initialize);
