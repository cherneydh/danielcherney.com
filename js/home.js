const subdirectories = ['games', 'musings', 'records'];
const fileData = [];

async function fetchFiles(subdirectory) {
    try {
        const response = await fetch(`https://danielcherney.com.s3.amazonaws.com/${subdirectory}/index.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const articles = Array.from(doc.querySelectorAll('meta[name="creation-date"]')).map(meta => ({
            creationDate: new Date(meta.content),
            title: meta.nextElementSibling ? meta.nextElementSibling.textContent : '',
            content: meta.parentElement ? meta.parentElement.innerHTML : '',
            subdirectory
        }));
        fileData.push(...articles);
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
