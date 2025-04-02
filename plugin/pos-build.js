const { cpSync } = require('fs');


// Copia arquivos para a pasta de build
cpSync('src/icons/icon16.png', 'dist/src/icons/icon16.png');
cpSync('src/icons/icon48.png', 'dist/src/icons/icon48.png');
cpSync('src/icons/icon128.png', 'dist/src/icons/icon128.png');
cpSync('manifest.json', 'dist/manifest.json');
cpSync('pinned.html', 'dist/pinned.html');
cpSync('src/popup.js', 'dist/src/popup.js');
cpSync('src/background.js', 'dist/src/background.js');
cpSync('src/pinned.js', 'dist/src/pinned.js');

console.log('✅ Arquivos copiados com sucesso!');
