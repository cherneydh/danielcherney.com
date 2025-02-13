const fs = require('fs');
const path = require('path');
const articlesDir = path.join(__dirname, 'articles');

function generateArticlesJson() {
    const articles = [];

    // Read the articles directory
    fs.readdirSync(articlesDir).forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(articlesDir, file);
            const content = fs.readFileSync(filePath, 'utf8');

            // Extract title and creation date
            const titleMatch = content.match(/<title>(.*?)<\/title>/);
            const dateMatch = content.match(/<meta\s+name="creation-date"\s+content="(.*?)"/);

            if (titleMatch && dateMatch) {
                articles.push({
                    title: titleMatch[1],
                    url: `/articles/${file}`,
                    creationDate: dateMatch[1]
                });
            }
        }
    });

    // Sort by creation date (latest first)
    articles.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

    // Save to articles.json
    fs.writeFileSync(path.join(__dirname, 'articles.json'), JSON.stringify(articles, null, 2));

    console.log('✅ articles.json generated successfully!');
}

generateArticlesJson();