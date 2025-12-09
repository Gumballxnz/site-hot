const fs = require('fs');

const indexPath = 'index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// Remover autoplay e adicionar preload="metadata" para melhor performance mobile
content = content.replace(/autoplay muted loop playsinline loading="lazy"/g, 'muted loop playsinline preload="metadata"');

fs.writeFileSync(indexPath, content, 'utf8');

console.log('✓ Vídeos otimizados com preload="metadata"');
console.log('  - Removido "autoplay" para economizar dados');
console.log('  - Removido "loading=lazy" (não funciona bem com vídeo)');
console.log('  - Adicionado "preload=metadata" para carregar apenas informações básicas');
