const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: 'dm3glrwax',
    api_key: '662363788356794',
    api_secret: 'FB-mJ-oYx6x9t3Wc_lO95u8sHQc'
});

const projectRoot = path.resolve(__dirname);

function getFiles(dir) {
    let files = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                    files = files.concat(getFiles(fullPath));
                }
            } else {
                if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
                    files.push(fullPath);
                }
            }
        });
    } catch (e) { }
    return files;
}

async function fix() {
    console.log("Fetching Cloudinary resources...");

    let allResources = [];
    let nextCursor = null;

    // Fetch all video resources (pagination)
    do {
        const result = await cloudinary.api.resources({
            resource_type: 'video',
            type: 'upload',
            max_results: 500,
            next_cursor: nextCursor,
            prefix: 'Netflix-foda/' // Filter by our project folder
        });
        allResources = allResources.concat(result.resources);
        nextCursor = result.next_cursor;
        console.log(`Fetched ${result.resources.length} resources...`);
    } while (nextCursor);

    console.log(`Total resources found: ${allResources.length}`);

    // Create a map: lowercase(filename) -> secure_url
    // We need to match based on the relative path used in code.
    // Code uses e.g. "Previas-mom/Vid/3.MP4"
    // Public ID is like "Netflix-foda/SubPacks/Previas-mom/Vid/3" (no extension usually in ID, but url has it)
    // Actually Cloudinary resources list provides `public_id` and `secure_url`.
    // The secure_url ends with `.mp4` or `.mov` etc.

    // Strategy:
    // Build a map of "normalized key" -> "correct URL"
    // Normalized key = lowercase path starting from "Previas-..."

    const urlMap = {};

    allResources.forEach(res => {
        // res.public_id example: "Netflix-foda/SubPacks/Previas-mom/Vid/3"
        // res.format example: "mp4"
        // res.secure_url example: ".../Previas-mom/Vid/3.mp4"

        // We want to match code usage like: "../Previas-mom/Vid/3.mp4"
        // Extract the part after "SubPacks/"
        const parts = res.public_id.split('SubPacks/');
        if (parts.length > 1) {
            const relativePath = parts[1]; // "Previas-mom/Vid/3"
            // Code might references "Previas-mom/Vid/3.mp4" or "Previas-mom/Vid/3.MP4"

            // Let's store two keys: with and without extension, lowercase.
            const keyBase = relativePath.toLowerCase(); // "previas-mom/vid/3"

            // Store both the exact URL and maybe variations if needed
            // But Cloudinary URL usually has extension.
            urlMap[keyBase] = res.secure_url;

            // Also store with extension if we can guess it? 
            // Actually, the regex in code matches the extension. 
            // So if code says "3.MP4", key is "previas-mom/vid/3.mp4"

            urlMap[keyBase + '.' + res.format] = res.secure_url;

            // Handle cases where code has different extension than cloudinary?
            // E.g. code "vid.mov", cloudinary "vid.mp4" (transcoded?) -> unlikely, we uploaded as is.
        }
    });

    console.log(`Map built with ${Object.keys(urlMap).length} entries.`);

    const files = getFiles(projectRoot);
    let changes = 0;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Regex to find video paths (same as before)
        // We look for anything starting with Previas- and ending in video extension
        const regex = /(['"])(\.\.\/|\.\/)?(Previas-[^\/]+\/Vid\/[^"']+\.(?:mp4|MP4|3gp|3GP|mov|MOV))(['"])/g;

        content = content.replace(regex, (match, quote1, prefix, videoPath, quote2) => {
            // videoPath e.g. "Previas-mom/Vid/3.MP4"
            const lowerKey = videoPath.toLowerCase();

            if (urlMap[lowerKey]) {
                const newUrl = urlMap[lowerKey];
                if (newUrl !== match.replace(/"/g, '').replace(/'/g, '')) { // Avoid double replacement if simple check
                    // Check if it's already a URL? The regex expects "Previas-...", so it won't match "https://..."
                    console.log(`Fixing case in ${path.basename(file)}: ${videoPath} -> ${newUrl}`);
                    modified = true;
                    changes++;
                    return `${quote1}${newUrl}${quote2}`;
                }
            } else {
                // Try matching without extension
                const noExt = lowerKey.substring(0, lowerKey.lastIndexOf('.'));
                if (urlMap[noExt]) {
                    console.log(`Fixing (fuzzy) in ${path.basename(file)}: ${videoPath} -> ${urlMap[noExt]}`);
                    modified = true;
                    changes++;
                    return `${quote1}${urlMap[noExt]}${quote2}`;
                }
                console.warn(`Warning: No match found for ${videoPath} in ${path.basename(file)}`);
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
        }
    });

    console.log(`Total intelligent fixes: ${changes}`);
}

fix();
