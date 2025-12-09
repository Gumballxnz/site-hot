const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
// const glob = require('glob'); // Removed glob dependency to rely on built-in fs

// Configuração
cloudinary.config({ 
  cloud_name: 'dm3glrwax', 
  api_key: '662363788356794', 
  api_secret: 'FB-mJ-oYx6x9t3Wc_lO95u8sHQc' 
});

const projectRoot = path.resolve(__dirname);

// Função para buscar arquivos recursivamente
function getFiles(dir, ext) {
  let files = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      try {
          const stat = fs.statSync(fullPath);
          if (stat && stat.isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
              files = files.concat(getFiles(fullPath, ext));
            }
          } else {
            if (fullPath.endsWith(ext)) {
              files.push(fullPath);
            }
          }
      } catch (e) {
          // ignore access errors
      }
    });
  } catch (e) {
      // ignore access errors
  }
  return files;
}

function normalize(p) {
    return p.replace(/\\/g, '/');
}

async function processVideos() {
  console.log('Iniciando busca de vídeos...');
  const videos = getFiles(projectRoot, '.mp4');
  console.log(`Encontrados ${videos.length} vídeos.`);

  const mapLocalToRemote = {};

  for (const videoPath of videos) {
    const relativePath = normalize(path.relative(projectRoot, videoPath));
    console.log(`\nProcessando: ${relativePath}`);
    
    try {
      // Upload
      const result = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
        public_id: relativePath.replace('.mp4', ''), // Use path as ID to organize
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        timeout: 120000 // 2 minutes timeout per file
      });

      console.log(`  -> Upload concluído: ${result.secure_url}`);
      mapLocalToRemote[relativePath] = result.secure_url;

    } catch (error) {
      console.error(`  -> Erro no upload:`, error.message);
    }
  }

  console.log('\nSubstituindo referências nos arquivos...');
  const codeFiles = [
      ...getFiles(projectRoot, '.html'),
      ...getFiles(projectRoot, '.css'),
      ...getFiles(projectRoot, '.js'),
      ...getFiles(projectRoot, '.json') // vercel.json or others might have refs
  ];

  let changesCount = 0;

  // We iterate over videos and find their references in code
  for (const [videoRelPath, remoteUrl] of Object.entries(mapLocalToRemote)) {
      const filename = path.basename(videoRelPath); // e.g., vid1.mp4
      const parentDir = path.basename(path.dirname(videoRelPath)); // e.g., Vid
      const grandParentDir = path.basename(path.dirname(path.dirname(videoRelPath))); // e.g., Previas-anita
      
      // Construct a search key that is likely unique in the code, e.g., "https://res.cloudinary.com/dm3glrwax/video/upload/v1765281463/Netflix-foda/SubPacks/Previas-anita/Vid/vid1.mp4"
      const uniqueSnippet = `${grandParentDir}/${parentDir}/${filename}`;
      
      // Regex to match any path ending with this snippet inside quotes
      // Matches: "https://res.cloudinary.com/dm3glrwax/video/upload/v1765281463/Netflix-foda/SubPacks/Previas-anita/Vid/vid1.mp4", "https://res.cloudinary.com/dm3glrwax/video/upload/v1765281463/Netflix-foda/SubPacks/Previas-anita/Vid/vid1.mp4", "https://res.cloudinary.com/dm3glrwax/video/upload/v1765281463/Netflix-foda/SubPacks/Previas-anita/Vid/vid1.mp4"
      // Quotes: " or '
      
      for (const file of codeFiles) {
          let content = fs.readFileSync(file, 'utf8');
          let fileModified = false;
          
          if (!content.includes(uniqueSnippet)) continue; // optimization
          
          const lines = content.split('\n');
          const newLines = lines.map(line => {
              // Regex: Capture quote, capture path ending in snippet, capture quote
              const regex = new RegExp(`(['"])([^'"]*${uniqueSnippet})(['"])`, 'g');
              
              if (regex.test(line)) {
                  const newLine = line.replace(regex, `$1${remoteUrl}$3`);
                  if (newLine !== line) {
                      changesCount++;
                      fileModified = true;
                      console.log(`  -> Atualizado em ${path.basename(file)}: ${uniqueSnippet} -> URL`);
                      return newLine;
                  }
              }
              return line;
          });
          
          if (fileModified) {
              fs.writeFileSync(file, newLines.join('\n'), 'utf8');
          }
      }
  }

  // Handle "principal.mp4" and others that might be in root or elsewhere
  // (Adding specific logic if needed, but the loop above covers deep paths)

  console.log(`\nConcluído! Total de substituições: ${changesCount}`);
}

processVideos();
