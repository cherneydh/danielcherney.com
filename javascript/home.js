const folders = ["games", "records", "musings"];
const fileData = [];

async function fetchFiles() {
    for (const folder of folders) {
        const response = await fetch(`https://danielcherney.s3.amazonaws.com/${folder}/index.html`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const creationDate = doc.querySelector('meta[name="creation-date"]').content;
        const title = doc.querySelector('title').textContent;
        fileData.push({ title, creationDate, folder });
    }
}

function populateHomepage() {
    const mostRecent = fileData.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))[0];
    const latestArticle = document.getElementById('latest-article');
    latestArticle.innerHTML = `
        <p>Check out the latest article: <a href="${mostRecent.folder}/index.html">${mostRecent.title}</a></p>
    `;
}

async function initialize() {
    await fetchFiles();
    populateHomepage();
}

initialize();