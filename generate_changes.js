const fs = require('fs');
const { execSync } = require('child_process');

function generateChangesJson() {
    try {
        // Get the list of changed files
        const changedFiles = execSync('git diff --name-only HEAD^ HEAD').toString().trim().split('\n');
        
        // Create a JSON object
        const changes = { files: changedFiles };
        
        // Save to changes.json
        fs.writeFileSync('changes.json', JSON.stringify(changes, null, 2));

        console.log('✅ changes.json generated successfully!');
    } catch (error) {
        console.error('Error generating changes.json:', error.message);
    }
}

generateChangesJson();
