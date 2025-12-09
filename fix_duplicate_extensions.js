const fs = require('fs');
const path = require('path');

const subpacksDir = path.join(__dirname, 'SubPacks');

// 1. Corrigir extensões duplicadas
console.log('=== Corrigindo extensões duplicadas ===\n');

function fixDuplicateExtensions(dir) {
    const folders = fs.readdirSync(dir).filter(f =>
        f.startsWith('Previas-') && fs.statSync(path.join(dir, f)).isDirectory()
    );

    let totalFixed = 0;

    folders.forEach(folder => {
        const jsPath = path.join(dir, folder, 'js', 'carousel_li_2.js');
        const indexPath = path.join(dir, folder, 'index.html');

        [jsPath, indexPath].forEach(filePath => {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                const originalContent = content;

                // Corrigir extensões duplicadas
                content = content.replace(/\.MP4\.mp4/g, '.mp4');
                content = content.replace(/\.3gp\.3gp/g, '.3gp');
                content = content.replace(/\.mov\.mov/g, '.mov');

                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`✓ ${folder}/${path.basename(filePath)}: extensões corrigidas`);
                    totalFixed++;
                }
            }
        });
    });

    console.log(`\nTotal de arquivos corrigidos: ${totalFixed}`);
}

fixDuplicateExtensions(subpacksDir);

// 2. Também verificar index.html principal
console.log('\n=== Verificando index.html principal ===\n');
const mainIndexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(mainIndexPath)) {
    let content = fs.readFileSync(mainIndexPath, 'utf8');
    const originalContent = content;

    content = content.replace(/\.MP4\.mp4/g, '.mp4');
    content = content.replace(/\.3gp\.3gp/g, '.3gp');

    if (content !== originalContent) {
        fs.writeFileSync(mainIndexPath, content, 'utf8');
        console.log('✓ index.html principal corrigido');
    } else {
        console.log('○ index.html principal OK');
    }
}

console.log('\n✅ Correções concluídas!');
