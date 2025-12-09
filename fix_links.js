const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname);

function getFiles(dir, ext) {
    let files = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                    files = files.concat(getFiles(fullPath, ext));
                }
            } else {
                // Look for .js, .html, .css
                if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
                    files.push(fullPath);
                }
            }
        });
    } catch (e) { }
    return files;
}

const files = getFiles(projectRoot);
let changes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Regex to find relative paths to videos
    // Captures: 
    // group 1: quote
    // group 2: relative prefix (../ or ./)
    // group 3: The path starting with Previas-...
    // group 4: quote
    const regex = /(['"])(\.\.\/|\.\/)?(Previas-[^\/]+\/Vid\/[^"']+\.(?:mp4|MP4|3gp|3GP|mov|MOV))(['"])/g;

    content = content.replace(regex, (match, quote1, prefix, videoPath, quote2) => {
        // Construct new Cloudinary URL
        // We assume the video was uploaded to Netflix-foda/SubPacks/...
        // Note: The previous script used `relativePath` which was `Netflix-foda/SubPacks/Previas...`
        // videoPath captured here is `Previas-nome/Vid/file.mp4`

        // So we need to prepend `Netflix-foda/SubPacks/`
        const cloudUrl = `https://res.cloudinary.com/dm3glrwax/video/upload/v1/Netflix-foda/SubPacks/${videoPath}`;

        console.log(`Fixing in ${path.basename(file)}: ${match} -> ${cloudUrl}`);
        modified = true;
        changes++;
        return `${quote1}${cloudUrl}${quote2}`;
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log(`Total fixes: ${changes}`);
