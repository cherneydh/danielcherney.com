const folder = window.location.pathname.split('/').pop().split('.')[0];
const fileData = [];

async function fetchFiles() {
    const response = await fetch(`https://danielcherney.com.s3.amazonaws.com/${folder}/index.html`);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const articles = doc.querySelectorAll('meta[name="creation-date"]');
    
    articles.forEach(article => {
        const creationDate = article.content;
        const title = article.nextElementSibling.textContent;
        fileData.push({ title, creationDate });
    });
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