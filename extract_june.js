import fs from 'fs';
const backup = fs.readFileSync('backup.sql', 'utf8');
const lines = backup.split('\n');
const juneLines = lines.filter(line => line.includes('INSERT INTO "transactions"') && line.includes('2026-06-'));
// Cloudflare export usually quotes table names and columns: INSERT INTO "transactions" ("id",...) VALUES (...)
// If it doesn't have quotes, try without quotes
const juneLines2 = lines.filter(line => line.includes('INSERT INTO transactions') && line.includes('2026-06-'));
const allJune = [...juneLines, ...juneLines2];

fs.writeFileSync('june.sql', allJune.join('\n') + '\n');
console.log('Extracted ' + allJune.length + ' transactions for June.');
