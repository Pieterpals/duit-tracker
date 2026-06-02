import fs from 'fs';
const str = "01 Makan dan Minum		 Rp 982,600 	 Rp 130,000";
const cols = str.split('\t');
console.log(cols);
function parseAmount(str) {
  if (!str || !str.trim()) return 0;
  let s = str.replace(/Rp/g, '').replace(/[.,]/g, '').trim();
  if (s === '-' || s === '') return 0;
  return parseInt(s, 10) || 0;
}
for (let i = 1; i < cols.length; i++) {
  console.log(i, cols[i], parseAmount(cols[i]));
}
