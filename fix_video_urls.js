const fs = require('fs');
const path = require('path');

// Carregar URLs corretas do Cloudinary
const cloudinaryVideos = JSON.parse(fs.readFileSync('cloudinary_videos.json', 'utf8'));

// Diretório das SubPacks
const subpacksDir = path.join(__dirname, 'SubPacks');

// Função para encontrar URL correta do Cloudinary
function findCloudinaryUrl(localPath) {
    // Tentar encontrar por nome do arquivo
    for (const [key, url] of Object.entries(cloudinaryVideos)) {
        if (key.includes(localPath) || localPath.includes(key)) {
            return url;
        }
    }
    return null;
}

// Lista de pastas para verificar
const folders = fs.readdirSync(subpacksDir).filter(f =>
    f.startsWith('Previas-') && fs.statSync(path.join(subpacksDir, f)).isDirectory()
);

console.log(`Verificando ${folders.length} pastas...\n`);

const report = [];

folders.forEach(folder => {
    const jsPath = path.join(subpacksDir, folder, 'js', 'carousel_li_2.js');

    if (fs.existsSync(jsPath)) {
        const content = fs.readFileSync(jsPath, 'utf8');

        // Extrair URLs do array videoSources
        const urlRegex = /https:\/\/res\.cloudinary\.com[^"'\s,]+/g;
        const urls = content.match(urlRegex) || [];

        const issues = [];

        urls.forEach(url => {
            // Verificar se URL tem path incorreto
            if (url.includes('Netflix-foda/SubPacks')) {
                // Path incorreto, precisa de correção
                const fileName = url.split('/').pop();
                const folderName = folder;

                // Procurar URL correta
                let correctUrl = null;
                for (const [key, cloudUrl] of Object.entries(cloudinaryVideos)) {
                    if (key.includes(folderName) && (key.includes(fileName) || cloudUrl.includes(fileName))) {
                        correctUrl = cloudUrl;
                        break;
                    }
                }

                if (correctUrl && correctUrl !== url) {
                    issues.push({
                        wrong: url,
                        correct: correctUrl
                    });
                }
            }
        });

        if (issues.length > 0) {
            report.push({
                folder,
                file: jsPath,
                issues
            });

            // Corrigir o arquivo
            let newContent = content;
            issues.forEach(issue => {
                newContent = newContent.split(issue.wrong).join(issue.correct);
            });

            fs.writeFileSync(jsPath, newContent, 'utf8');
            console.log(`✓ ${folder}: ${issues.length} URL(s) corrigida(s)`);
        } else {
            console.log(`○ ${folder}: URLs OK`);
        }
    } else {
        console.log(`✗ ${folder}: arquivo JS não encontrado`);
    }
});

console.log(`\n=== Resumo ===`);
console.log(`Total de pastas: ${folders.length}`);
console.log(`Pastas corrigidas: ${report.length}`);

if (report.length > 0) {
    console.log(`\nDetalhes das correções:`);
    report.forEach(r => {
        console.log(`\n${r.folder}:`);
        r.issues.forEach(i => {
            console.log(`  - Corrigido: ${i.wrong.substring(0, 50)}...`);
        });
    });
}
