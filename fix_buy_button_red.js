const fs = require('fs');
const path = require('path');

const subpacksDir = path.join(__dirname, 'SubPacks');

// Estilo Netflix vermelho para o botão de preço
const oldPackPrice = `.pack_price {
    background-color: #ffffff;
    border-radius: 6px;
    padding: 10px 20px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: fit-content;
    color: black;
    font-weight: bold;
    font-size: 17px;
    box-shadow:  1px 0.4px 4x rgb(83, 83, 83);
}`;

const newPackPrice = `.pack_price {
    background-color: #e50914;
    border-radius: 8px;
    padding: 12px 24px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: fit-content;
    color: white;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    cursor: pointer;
    transition: all 0.2s ease;
}

.pack_price:hover {
    background-color: #f40612;
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(229, 9, 20, 0.5);
}`;

const folders = fs.readdirSync(subpacksDir).filter(f =>
    f.startsWith('Previas-') && fs.statSync(path.join(subpacksDir, f)).isDirectory()
);

let updated = 0;

folders.forEach(folder => {
    const cssPath = path.join(subpacksDir, folder, 'css', 'styles_carousel_l1.css');

    if (fs.existsSync(cssPath)) {
        let content = fs.readFileSync(cssPath, 'utf8');

        // Substituir estilo antigo pelo novo
        if (content.includes('background-color: #ffffff') && content.includes('.pack_price')) {
            content = content.replace(
                /\.pack_price\s*\{[^}]+background-color:\s*#ffffff[^}]+\}/,
                newPackPrice
            );

            fs.writeFileSync(cssPath, content, 'utf8');
            console.log(`✓ ${folder}/styles_carousel_l1.css: botão "Compre agora" → VERMELHO`);
            updated++;
        } else {
            console.log(`○ ${folder}/styles_carousel_l1.css: já atualizado ou diferente`);
        }
    }
});

console.log(`\n✅ ${updated} arquivos atualizados com botão vermelho!`);
