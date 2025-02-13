const folder = window.location.pathname.split('/').pop().split('.')[0];
const fileData = [];

async function fetchFiles() {
    try {
        const response = await fetch(`https://danielcherney.com.s3.amazonaws.com/${folder}/index.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const articles = doc.querySelectorAll('meta[name="creation-date"]');

        articles.forEach(article => {
            const creationDate = article.content;
            const title = article.nextElementSibling.textContent;
            fileData.push({ title, creationDate });
        });
    } catch (error) {
        console.error('Failed to fetch files:', error);
    }
}

function populateList() {
    const list = document.getElementById(`${folder}-list`);
    fileData.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
    fileData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title;
        list.appendChild(li);
    });
}

async function initialize() {
    await fetchFiles();
    populateList();
}

initialize();
