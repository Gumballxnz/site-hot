const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: 'dm3glrwax',
    api_key: '662363788356794',
    api_secret: 'FB-mJ-oYx6x9t3Wc_lO95u8sHQc'
});

const oldProjectDir = path.join(__dirname, 'Netflix-foda', 'Netflix-foda', 'SubPacks');
const videosJson = JSON.parse(fs.readFileSync('cloudinary_videos.json', 'utf8'));

// Encontrar todos os vídeos na pasta antiga
function findAllVideos(dir) {
    const videos = [];
    const extensions = ['.mp4', '.mov', '.3gp', '.avi', '.MP4', '.MOV'];

    function walkDir(currentDir) {
        if (!fs.existsSync(currentDir)) return;

        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (extensions.some(ext => file.endsWith(ext))) {
                videos.push(filePath);
            }
        }
    }

    walkDir(dir);
    return videos;
}

async function uploadVideos() {
    console.log('=== Buscando vídeos na pasta antiga ===\n');

    const allVideos = findAllVideos(oldProjectDir);
    console.log(`Encontrados ${allVideos.length} vídeos na pasta antiga\n`);

    if (allVideos.length === 0) {
        console.log('Verificando caminho alternativo...');
        const altDir = path.join(__dirname, 'Netflix-foda', 'SubPacks');
        const altVideos = findAllVideos(altDir);
        console.log(`Encontrados ${altVideos.length} vídeos no caminho alternativo`);
        allVideos.push(...altVideos);
    }

    const newUrls = {};
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const videoPath of allVideos) {
        // Extrair caminho relativo para public_id
        const relativePath = videoPath.split('SubPacks')[1];
        if (!relativePath) continue;

        const publicId = 'SubPacks' + relativePath.replace(/\\/g, '/').replace(/\.[^.]+$/, '');

        // Verificar se já existe no Cloudinary
        const existingKey = Object.keys(videosJson).find(k =>
            k.includes(path.basename(publicId)) || publicId.includes(k.split('/').pop())
        );

        if (existingKey) {
            console.log(`⏭️ Pulando (já existe): ${path.basename(videoPath)}`);
            skipped++;
            continue;
        }

        try {
            console.log(`📤 Uploading: ${path.basename(videoPath)}...`);

            const result = await cloudinary.uploader.upload(videoPath, {
                resource_type: 'video',
                public_id: publicId,
                overwrite: false,
                timeout: 300000 // 5 minutos timeout
            });

            newUrls[publicId] = result.secure_url;
            console.log(`  ✓ Sucesso: ${result.secure_url.substring(0, 60)}...`);
            uploaded++;

        } catch (err) {
            console.error(`  ✗ Erro: ${err.message}`);
            failed++;
        }
    }

    // Salvar novas URLs
    if (Object.keys(newUrls).length > 0) {
        const allUrls = { ...videosJson, ...newUrls };
        fs.writeFileSync('cloudinary_videos.json', JSON.stringify(allUrls, null, 2));
        fs.writeFileSync('new_uploads.json', JSON.stringify(newUrls, null, 2));
    }

    console.log('\n=== Resumo ===');
    console.log(`✓ Enviados: ${uploaded}`);
    console.log(`⏭️ Pulados (já existiam): ${skipped}`);
    console.log(`✗ Falharam: ${failed}`);
    console.log(`Total processados: ${allVideos.length}`);
}

uploadVideos().catch(console.error);
