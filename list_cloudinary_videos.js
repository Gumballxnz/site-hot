const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dm3glrwax',
    api_key: '662363788356794',
    api_secret: 'FB-mJ-oYx6x9t3Wc_lO95u8sHQc'
});

async function listVideos() {
    try {
        console.log('Buscando vídeos no Cloudinary...');

        // Listar vídeos
        const result = await cloudinary.api.resources({
            resource_type: 'video',
            max_results: 100
        });

        console.log(`Encontrados ${result.resources.length} vídeos:`);

        const videoUrls = {};
        result.resources.forEach(video => {
            console.log(`- ${video.public_id}: ${video.secure_url}`);
            videoUrls[video.public_id] = video.secure_url;
        });

        // Salvar URLs
        fs.writeFileSync('cloudinary_videos.json', JSON.stringify(videoUrls, null, 2));
        console.log('\n✓ URLs salvas em cloudinary_videos.json');

    } catch (error) {
        console.error('Erro:', error.message);
    }
}

listVideos();
