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
const indexPath = path.join(__dirname, 'index.html');

async function uploadImages() {
    const files = fs.readdirSync(imagensDir).filter(f =>
        f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png')
    );
    const results = {};

    console.log(`Encontradas ${files.length} imagens para upload...`);
    console.log('');

    for (const file of files) {
        const filePath = path.join(imagensDir, file);
        const baseName = path.parse(file).name;

        try {
            console.log(`Fazendo upload: ${file}...`);
            const result = await cloudinary.uploader.upload(filePath, {
                public_id: `Netflix-foda/${baseName}`,
                overwrite: true,
                resource_type: 'image'
            });
            results[file] = result.secure_url;
            console.log(`  ✓ Sucesso: ${result.secure_url}`);
        } catch (err) {
            console.error(`  ✗ Erro: ${err.message}`);
        }
    }

    // Salvar URLs para referência
    fs.writeFileSync('cloudinary_urls_real.json', JSON.stringify(results, null, 2));
    console.log('\n📁 URLs salvas em cloudinary_urls_real.json');

    // Atualizar index.html
    if (Object.keys(results).length > 0) {
        let html = fs.readFileSync(indexPath, 'utf8');
        let count = 0;

        for (const [file, url] of Object.entries(results)) {
            const localPath = `imagens-hot/${file}`;
            if (html.includes(localPath)) {
                html = html.split(localPath).join(url);
                count++;
                console.log(`Substituindo: ${localPath}`);
            }
        }

        fs.writeFileSync(indexPath, html, 'utf8');
        console.log(`\n✓ index.html atualizado! (${count} substituições)`);
    }

    return results;
}

uploadImages().then(() => {
    console.log('\n🎉 Upload concluído com sucesso!');
}).catch(err => {
    console.error('Erro geral:', err.message);
});
