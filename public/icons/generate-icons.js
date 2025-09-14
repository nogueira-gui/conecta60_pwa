// Script para gerar ícones PWA
// Este é um placeholder - em produção, você usaria ícones reais

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria um SVG simples como placeholder
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563EB" rx="${size * 0.1}"/>
  <circle cx="${size * 0.5}" cy="${size * 0.35}" r="${size * 0.15}" fill="white"/>
  <rect x="${size * 0.25}" y="${size * 0.55}" width="${size * 0.5}" height="${size * 0.08}" fill="white" rx="${size * 0.02}"/>
  <rect x="${size * 0.3}" y="${size * 0.68}" width="${size * 0.4}" height="${size * 0.06}" fill="white" rx="${size * 0.02}"/>
  <text x="${size * 0.5}" y="${size * 0.9}" text-anchor="middle" fill="white" font-family="Arial" font-size="${size * 0.08}" font-weight="bold">60+</text>
</svg>`;

// Tamanhos de ícones necessários
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Gerando ícones PWA...');

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(__dirname, filename), svg);
  console.log(`✓ Gerado ${filename}`);
});

console.log('Ícones gerados com sucesso!');
console.log('NOTA: Em produção, converta os SVGs para PNG usando uma ferramenta como ImageMagick ou online converter.');