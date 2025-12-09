const fs = require('fs');

const indexPath = 'index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// Padrão: mover onclick do div.card para o button.buy-btn
// De: <div class="card" onclick="openPopup('URL')">...<button class="buy-btn">Preview</button>
// Para: <div class="card">...<button class="buy-btn" onclick="openPopup('URL'); event.stopPropagation();">Preview</button>

// Encontrar todos os cards com onclick e mover para o botão
const cardRegex = /<div class="card" onclick="openPopup\('([^']+)'\);?">\s*<img([^>]+)>\s*<div class="card-content">\s*<h2>(\d+)<\/h2>\s*<span>([^<]+)<\/span>\s*<button class="buy-btn">Preview<\/button>/g;

content = content.replace(cardRegex, (match, url, imgAttrs, num, name) => {
    return `<div class="card">
                <img${imgAttrs}>
                <div class="card-content">
                    <h2>${num}</h2>
                    <span>${name}</span>
                    <button class="buy-btn" onclick="openPopup('${url}'); event.stopPropagation();">Preview</button>`;
});

// Também corrigir cards que têm "All teens" ou "All cp" (links externos do Telegram)
const telegramCardRegex = /<div class="card" onclick="openPopup\('(https:\/\/t\.me\/[^']+)'\)">/g;
content = content.replace(telegramCardRegex, '<div class="card">');

fs.writeFileSync(indexPath, content, 'utf8');

console.log('✓ Onclick movido do card para o botão Preview');
console.log('  - Agora cliques na imagem NÃO abrem a prévia');
console.log('  - Apenas o botão Preview abre a prévia');
