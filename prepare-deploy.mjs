/**
 * prepare-deploy.mjs
 * Script para preparar el paquete de despliegue de Catedral de León
 * Elimina archivos innecesarios del dist/ y genera un reporte
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Extensiones a eliminar del deploy (archivos de desarrollo)
const EXTENSIONS_TO_REMOVE = ['.blend', '.blend1', '.py', '.blend2'];

// Archivos individuales a eliminar
const FILES_TO_REMOVE = ['README.md'];

let totalRemoved = 0;
let totalSizeFreed = 0;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function removeUnnecessaryFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      removeUnnecessaryFiles(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const shouldRemove = EXTENSIONS_TO_REMOVE.includes(ext) || FILES_TO_REMOVE.includes(entry.name);
      
      if (shouldRemove) {
        const stat = fs.statSync(fullPath);
        const size = stat.size;
        fs.unlinkSync(fullPath);
        totalRemoved++;
        totalSizeFreed += size;
        console.log(`  🗑️  Eliminado: ${path.relative(distDir, fullPath)} (${formatBytes(size)})`);
      }
    }
  }
}

function getDirectorySize(dir) {
  let size = 0;
  if (!fs.existsSync(dir)) return 0;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else {
      size += fs.statSync(fullPath).size;
    }
  }
  return size;
}

function listGlbFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listGlbFiles(fullPath, files);
    } else if (entry.name.endsWith('.glb')) {
      const stat = fs.statSync(fullPath);
      files.push({ 
        path: path.relative(distDir, fullPath), 
        size: stat.size,
        name: entry.name
      });
    }
  }
  return files;
}

console.log('\n🏛️  PREPARACIÓN DE DEPLOY - Catedral de León\n');
console.log('='.repeat(50));

// Paso 1: Verificar que dist existe
if (!fs.existsSync(distDir)) {
  console.error('❌ ERROR: La carpeta dist/ no existe. Ejecuta primero: npm run build');
  process.exit(1);
}

console.log('\n📁 Tamaño inicial del dist/:', formatBytes(getDirectorySize(distDir)));

// Paso 2: Eliminar archivos innecesarios
console.log('\n🧹 Limpiando archivos innecesarios...');
removeUnnecessaryFiles(distDir);

if (totalRemoved === 0) {
  console.log('   ✅ No hay archivos innecesarios que eliminar');
} else {
  console.log(`\n   ✅ ${totalRemoved} archivo(s) eliminado(s), liberando ${formatBytes(totalSizeFreed)}`);
}

// Paso 3: Listar modelos 3D
const glbFiles = listGlbFiles(distDir);
console.log('\n🎨 Modelos 3D en el deploy:');
let totalGlbSize = 0;
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50 MB

for (const file of glbFiles) {
  const isLarge = file.size > LARGE_FILE_THRESHOLD;
  const icon = isLarge ? '⚠️ ' : '  ✅';
  console.log(`  ${icon} ${file.name}: ${formatBytes(file.size)}${isLarge ? ' (ARCHIVO GRANDE - considera CDN externo)' : ''}`);
  totalGlbSize += file.size;
}
console.log(`\n   Total modelos 3D: ${formatBytes(totalGlbSize)}`);

// Paso 4: Tamaño final
const finalSize = getDirectorySize(distDir);
console.log('\n📊 Tamaño final del dist/:', formatBytes(finalSize));

// Paso 5: Verificar archivos críticos
console.log('\n🔍 Verificando archivos críticos...');
const criticalFiles = [
  'index.html',
  'assets'
];

for (const file of criticalFiles) {
  const exists = fs.existsSync(path.join(distDir, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
}

console.log('\n' + '='.repeat(50));
console.log('✅ DIST listo para deploy!\n');

// Paso 6: Recomendaciones según tamaño
if (finalSize > 100 * 1024 * 1024) {
  console.log('⚠️  ADVERTENCIA: El dist/ supera 100 MB.');
  console.log('   → Para Netlify/Vercel: sube catedral_leon.glb a GitHub Releases');
  console.log('   → Para Cloudflare Pages: usa wrangler CLI (sin límite de archivo)');
  console.log('   → Ver DEPLOY_GUIDE.md para instrucciones detalladas\n');
} else {
  console.log('🚀 Tamaño OK para todas las plataformas\n');
}
