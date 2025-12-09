const fs = require('fs');
const path = require('path');

const subpacksDir = path.join(__dirname, 'SubPacks');

// Estilo Netflix para os botões
const newButtonStyle = `
.action-button {
    background: #e50914;
    color: white;
    padding: 15px 24px;
    border-radius: 8px;
    text-align: center;
    width: 90%;
    margin-bottom: 15px;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-button:hover {
    background-color: #f40612;
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(229, 9, 20, 0.5);
}

.action-button:active {
    transform: scale(0.98);
}
`;

// Encontrar padrão antigo e substituir
const oldPattern = /\.action-button\s*\{[^}]+background:\s*white;[^}]+\}[\s\S]*?\.action-button:hover\s*\{[^}]+\}[\s\S]*?\.action-button:active\s*\{[^}]+\}/g;

const folders = fs.readdirSync(subpacksDir).filter(f =>
    f.startsWith('Previas-') && fs.statSync(path.join(subpacksDir, f)).isDirectory()
);

let updated = 0;

folders.forEach(folder => {
    const cssPath = path.join(subpacksDir, folder, 'css', 'popup_pay_with.css');

    if (fs.existsSync(cssPath)) {
        let content = fs.readFileSync(cssPath, 'utf8');

        // Substituir estilos antigos pelos novos (vermelho Netflix)
        if (content.includes('background: white') && content.includes('.action-button')) {
            // Substituir a seção do action-button
            content = content.replace(
                /\.action-button\s*\{[\s\S]*?background:\s*white;[\s\S]*?\}/,
                `.action-button {
    background: #e50914;
    color: white;
    padding: 15px 24px;
    border-radius: 8px;
    text-align: center;
    width: 90%;
    margin-bottom: 15px;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}`
            );

            // Substituir hover
            content = content.replace(
                /\.action-button:hover\s*\{[\s\S]*?background-color:\s*white;[\s\S]*?\}/,
                `.action-button:hover {
    background-color: #f40612;
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(229, 9, 20, 0.5);
}`
            );

            fs.writeFileSync(cssPath, content, 'utf8');
            console.log(`✓ ${folder}/popup_pay_with.css: botões atualizados para vermelho`);
            updated++;
        } else {
            console.log(`○ ${folder}/popup_pay_with.css: já atualizado ou diferente`);
        }
    }
});

console.log(`\n✅ ${updated} arquivos atualizados com botões vermelhos Netflix!`);
