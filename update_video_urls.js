const fs = require('fs');

// URLs do Cloudinary para vídeos
const videoUrls = {
    "SubPacks/Previas-ivank/Vid/vid1.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765300266/SubPacks/Previas-ivank/Vid/vid1.mp4",
    "SubPacks/Previas-incest/Vid/2.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304209/SubPacks/Previas-incest/Vid/2.mp4",
    "SubPacks/Previas-lizzy/Vid/primeiro.3gp": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304301/SubPacks/Previas-lizzy/Vid/primeiro.3gp",
    "SubPacks/Previas-anita/Vid/pri.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765303974/SubPacks/Previas-anita/Vid/pri.mp4",
    "SubPacks/Previas-ash/Vid/principal.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765299926/SubPacks/Previas-ash/Vid/principal.mp4",
    "SubPacks/Previas-omegle/Vid/vid1.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304439/SubPacks/Previas-omegle/Vid/vid1.mp4",
    "SubPacks/Previas-baby/Vid/Principal.MP4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304070/SubPacks/Previas-baby/Vid/Principal.MP4.mp4",
    "SubPacks/Previas-cp3/Vid/principal.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765300108/SubPacks/Previas-cp3/Vid/principal.mp4",
    "SubPacks/Previas-dad/Vid/p.mp4": "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304155/SubPacks/Previas-dad/Vid/p.mp4"
};

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf8');
let count = 0;

for (const [localPath, cloudinaryUrl] of Object.entries(videoUrls)) {
    if (html.includes(localPath)) {
        html = html.split(localPath).join(cloudinaryUrl);
        count++;
        console.log(`✓ Substituído: ${localPath}`);
    } else {
        console.log(`⚠ Não encontrado: ${localPath}`);
    }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\n🎉 ${count} vídeos substituídos no index.html!`);
