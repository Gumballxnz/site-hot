const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: 'dm3glrwax',
    api_key: '662363788356794',
    api_secret: 'FB-mJ-oYx6x9t3Wc_lO95u8sHQc'
});

const imagensDir = path.join(__dirname, 'imagens-hot');

// Novas imagens a serem enviadas
const newImages = [
    'IMAGE 2025-02-13 11.20.31.jpg',
    'IMAGE 2025-02-13 11.20.33.jpg',
    'IMAGE 2025-02-14 02.35.38.jpg',
    'IMAGE 2025-02-14 02.35.41.jpg'
];

async function uploadNewImages() {
    const results = {};

    console.log('=== Fazendo upload das novas imagens ===\n');

    for (const file of newImages) {
        const filePath = path.join(imagensDir, file);

        if (!fs.existsSync(filePath)) {
            console.log(`✗ Arquivo não encontrado: ${file}`);
            continue;
        }

        // Criar nome limpo para o Cloudinary
        const cleanName = file.replace(/[^a-zA-Z0-9.-]/g, '_').replace('.jpg', '');

        try {
            console.log(`📤 Uploading: ${file}...`);
            const result = await cloudinary.uploader.upload(filePath, {
                public_id: `Netflix-foda/${cleanName}`,
                overwrite: true,
                resource_type: 'image'
            });
            results[file] = result.secure_url;
            console.log(`  ✓ Sucesso: ${result.secure_url}`);
        } catch (err) {
            console.error(`  ✗ Erro: ${err.message}`);
        }
    }

    // Salvar URLs
    fs.writeFileSync('new_images_urls.json', JSON.stringify(results, null, 2));
    console.log('\n✅ URLs salvas em new_images_urls.json');
    console.log('\nURLs das novas imagens:');
    Object.entries(results).forEach(([file, url]) => {
        console.log(`  ${file}: ${url}`);
    });

    return results;
}

uploadNewImages().catch(console.error);
