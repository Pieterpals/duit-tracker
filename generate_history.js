import fs from 'fs';
import crypto from 'crypto';

const raw = `
Jan 2026																															
Expense Category	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28	29	30	31
 01 Makan dan Minum	 Rp24.000 	 Rp148.000 	 Rp102.000 	 Rp177.500 	 Rp26.000 	 Rp12.000 	 Rp48.000 	 Rp16.000 	 Rp76.000 	 Rp162.300 	 Rp108.000 	 Rp125.000 		 Rp16.000 	 Rp85.000 	 Rp494.100 	 Rp349.250 	 Rp559.100 	 Rp15.000 	 Rp10.000 	 Rp165.000 	 Rp156.000 	 Rp46.000 	 Rp60.000 	 Rp25.000 	 Rp13.000 		 Rp35.000 		 Rp70.500 	 Rp65.000 
 02 Transport		 Rp62.500 			 Rp64.000 	 Rp55.500 	 Rp59.500 	 Rp59.500 	 Rp25.500 	 Rp90.000 			 Rp34.000 	 Rp79.000 	 Rp67.000 		 Rp43.000 		 Rp52.500 	 Rp84.500 	 Rp12.000 	 Rp12.000 	 Rp10.000 			 Rp74.000 	 Rp81.000 	 Rp75.500 	 Rp46.000 	 Rp69.000 	
 03 Pulsa, Apartement, Parkir		 Rp282.394 										 Rp182.000 																	 Rp150.000 		
 04 Shopee				 Rp117.500 	 Rp142.000 				 Rp174.000 				 Rp199.000 				 Rp238.375 	 Rp273.000 		 Rp216.500 				 Rp226.000 		 Rp240.000 			 Rp27.400 		 Rp141.000 
 05 Listrik & PDAM																		 Rp77.500 				 Rp300.000 		 Rp300.000 							
 06 Untuk Orang Tua																													 Rp121.000 		
 07 Persembahan				 Rp200.000 						 Rp225.500 	 Rp200.000 									 Rp401.550 					 Rp200.000 						
 08 Kado					 Rp50.000 						 Rp172.000 																				
 09 Expense X																	 Rp298.000 	 Rp298.000 						 Rp140.000 			 Rp200.000 		 Rp302.500 		
 10 Expense X													 Rp300.000 														 Rp318.000 				
 11 Expense X																															
 12 Expense X																															
 13 Expense X																															
 Total Daily	 Rp24.000 	 Rp492.894 	 Rp102.000 	 Rp495.000 	 Rp282.000 	 Rp67.500 	 Rp107.500 	 Rp75.500 	 Rp275.500 	 Rp477.800 	 Rp480.000 	 Rp307.000 	 Rp533.000 	 Rp95.000 	 Rp152.000 	 Rp494.100 	 Rp928.625 	 Rp1.207.600 	 Rp67.500 	 Rp712.550 	 Rp177.000 	 Rp468.000 	 Rp56.000 	 Rp726.000 	 Rp225.000 	 Rp327.000 	 Rp599.000 	 Rp110.500 	 Rp646.900 	 Rp139.500 	 Rp206.000 
 Monthly expense Total	 Rp11.057.969 																														
																															
Feb 2026																															
Expense Category	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28	29	30	31
 01 Makan dan Minum	 Rp181.000 		 Rp65.500 	 Rp40.000 	 Rp10.000 	 Rp10.000 	 Rp150.000 		 Rp137.000 	 Rp33.000 	 Rp23.000 	 Rp40.000 	 Rp118.500 	 Rp193.000 	 Rp20.000 			 Rp46.500 	 Rp10.000 	 Rp21.000 		 Rp95.000 	 Rp16.000 	 Rp40.000 	 Rp105.200 		 Rp263.800 	 Rp633.000 			
 02 Transport		 Rp25.500 	 Rp82.500 	 Rp90.000 	 Rp68.500 	 Rp174.500 			 Rp5.000 	 Rp118.000 	 Rp69.500 	 Rp16.500 	 Rp118.500 			 Rp46.500 		 Rp108.500 	 Rp63.000 	 Rp69.500 			 Rp49.000 	 Rp73.000 	 Rp55.000 	 Rp22.500 	 Rp71.500 				
 03 Pulsa, Apartement, Parkir												 Rp120.000 														 Rp145.000 					
 04 Shopee		 Rp240.800 					 Rp91.000 											 Rp252.200 					 Rp40.000 	 Rp250.000 	 Rp171.900 						
 05 Listrik & PDAM			 Rp1.062.000 																												
 06 Untuk Orang Tua																															
 07 Persembahan	 Rp200.000 							 Rp200.000 							 Rp200.000 							 Rp100.000 									
 08 Kado														 Rp350.000 																	
 09 Expense X			 Rp83.000 					 Rp420.000 					 Rp100.000 	 Rp165.000 		 Rp180.000 					 Rp298.000 							 Rp300.000 			
 10 Expense X																												 Rp298.000 			
 11 Expense X																															
 12 Expense X																															
 13 Expense X																															
 Total Daily	 Rp381.000 	 Rp266.300 	 Rp1.293.000 	 Rp130.000 	 Rp78.500 	 Rp184.500 	 Rp241.000 	 Rp620.000 	 Rp142.000 	 Rp151.000 	 Rp92.500 	 Rp176.500 	 Rp337.000 	 Rp708.000 	 Rp220.000 	 Rp226.500 	 Rp- 	 Rp407.200 	 Rp73.000 	 Rp90.500 	 Rp298.000 	 Rp195.000 	 Rp105.000 	 Rp363.000 	 Rp332.100 	 Rp167.500 	 Rp335.300 	 Rp1.231.000 	 Rp- 	 Rp- 	 Rp- 
 Monthly expense Total	 Rp8.845.400 																														
																															
Mar 2026																															
Expense Category	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28	29	30	31
 01 Makan dan Minum	 Rp824.600 		 Rp182.000 	 Rp87.000 	 Rp307.000 	 Rp127.500 		 Rp166.000 	 Rp13.000 	 Rp55.000 	 Rp51.000 	 Rp142.000 	 Rp90.000 		 Rp85.000 	 Rp62.000 	 Rp95.000 		 Rp78.100 			 Rp110.000 	 Rp127.000 	 Rp20.000 	 Rp40.000 	 Rp10.000 	 Rp50.000 		 Rp227.303 	 Rp12.000 	 Rp109.200 
 02 Transport		 Rp96.000 	 Rp41.000 	 Rp62.000 	 Rp34.000 	 Rp86.000 			 Rp81.500 	 Rp139.500 	 Rp89.000 		 Rp122.500 		 Rp59.500 	 Rp41.500 			 Rp41.000 			 Rp34.500 			 Rp62.500 	 Rp67.500 	 Rp71.500 		 Rp118.500 	 Rp99.500 	 Rp53.000 
 03 Pulsa, Apartement, Parkir									 Rp4.000 			 Rp10.000 												 Rp48.300 							
 04 Shopee			 Rp193.000 	 Rp1.680.000 	 Rp311.500 				 Rp218.000 					 Rp244.500 	 Rp351.000 	 Rp78.000 						 Rp137.000 	 Rp223.000 	 Rp38.000 	 Rp182.000 				 Rp140.000 		 Rp155.000 
 05 Listrik & PDAM																															
 06 Untuk Orang Tua													 Rp500.000 									 Rp117.000 				 Rp112.000 					
 07 Persembahan	 Rp200.000 							 Rp200.000 							 Rp200.000 							 Rp200.000 							 Rp200.000 		
 08 Kado																															
 09 Olah raga				 Rp298.000 					 Rp520.000 							 Rp2.655.000 			 Rp2.804.000 			 Rp100.000 	 Rp349.000 						 Rp170.000 		 Rp150.000 
 10 Expense X		 Rp123.500 			 Rp50.000 			 Rp46.000 					 Rp577.000 						 Rp300.000 					 Rp20.000 							
 11 Expense X					 Rp300.000 			 Rp102.000 																							
 12 Expense X																															
 13 Expense X																															
 Total Daily	 Rp1.024.600 	 Rp219.500 	 Rp416.000 	 Rp2.127.000 	 Rp1.002.500 	 Rp213.500 	 Rp- 	 Rp514.000 	 Rp836.500 	 Rp194.500 	 Rp140.000 	 Rp152.000 	 Rp1.289.500 	 Rp244.500 	 Rp695.500 	 Rp2.836.500 	 Rp95.000 	 Rp- 	 Rp3.223.100 	 Rp- 	 Rp- 	 Rp698.500 	 Rp699.000 	 Rp126.300 	 Rp284.500 	 Rp189.500 	 Rp121.500 	 Rp- 	 Rp855.803 	 Rp111.500 	 Rp467.200 
 Monthly expense Total	 Rp18.778.003 																														
																															
Apr 2026																															
Expense Category	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28	29	30	
 01 Makan dan Minum	 Rp128.500 	 Rp32.000 	 Rp238.000 	 Rp295.000 	 Rp192.000 	 Rp19.000 	 Rp25.000 	 Rp48.500 	 Rp55.000 	 Rp98.500 	 Rp78.000 	 Rp162.000 		 Rp10.000 	 Rp242.000 	 Rp203.000 	 Rp110.500 		 Rp126.000 	 Rp77.000 	 Rp223.000 	 Rp185.000 	 Rp68.000 	 Rp47.000 		 Rp451.000 	 Rp84.500 	 Rp40.000 	 Rp38.000 	 Rp19.000 	
 02 Transport	 Rp100.000 	 Rp80.500 		 Rp350.000 		 Rp125.000 	 Rp95.000 	 Rp91.500 	 Rp107.000 	 Rp76.500 	 Rp32.000 	 Rp24.000 		 Rp45.500 	 Rp35.000 	 Rp80.000 	 Rp86.000 	 Rp25.000 		 Rp42.500 	 Rp35.000 	 Rp66.500 	 Rp91.500 	 Rp42.003 		 Rp29.500 	 Rp105.500 	 Rp82.500 	 Rp54.500 	 Rp67.000 	
 03 Pulsa, Apartement, Parkir															 Rp45.000 																
 04 Shopee	 Rp39.000 			 Rp188.500 					 Rp492.000 						 Rp62.000 							 Rp217.000 			 Rp537.000 				 Rp265.000 		
 05 Listrik & PDAM																															
 06 Untuk Orang Tua																															
 07 Persembahan			 Rp200.000 		 Rp200.000 							 Rp200.000 							 Rp200.000 							 Rp200.000 					
 08 Kado								 Rp500.000 																	 Rp250.000 						
 09 Olah raga	 Rp117.500 	 Rp600.000 	 Rp300.000 			 Rp217.750 					 Rp298.000 							 Rp195.000 		 Rp14.000 		 Rp14.000 									
 10 Expense X	 Rp100.000 					 Rp1.750.000 			 Rp450.000 		 Rp15.500 	 Rp37.400 						 Rp80.000 				 Rp105.000 		 Rp390.000 		 Rp400.000 					
 11 Expense X												 Rp487.000 																			
 12 Expense X																															
 13 Expense X																															
 Total Daily	 Rp485.000 	 Rp712.500 	 Rp738.000 	 Rp833.500 	 Rp392.000 	 Rp2.111.750 	 Rp120.000 	 Rp640.000 	 Rp1.104.000 	 Rp175.000 	 Rp423.500 	 Rp910.400 	 Rp- 	 Rp55.500 	 Rp384.000 	 Rp283.000 	 Rp196.500 	 Rp300.000 	 Rp326.000 	 Rp133.500 	 Rp258.000 	 Rp587.500 	 Rp159.500 	 Rp479.003 	 Rp787.000 	 Rp1.080.500 	 Rp190.000 	 Rp122.500 	 Rp357.500 	 Rp86.000 	 Rp- 
 Monthly expense Total	 Rp14.431.653 																														
																															
May 2026																															
Expense Category	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28	29	30	31
 01 Makan dan Minum		 Rp982.600 	 Rp130.000 	 Rp213.000 	 Rp104.000 	 Rp88.000 	 Rp90.000 	 Rp110.000 	 Rp132.000 	 Rp49.000 		 Rp41.000 	 Rp12.000 	 Rp185.000 	 Rp173.000 	 Rp133.000 															
 02 Transport		 Rp64.000 		 Rp76.500 	 Rp34.500 	 Rp74.500 	 Rp58.500 	 Rp102.500 	 Rp93.000 	 Rp57.500 	 Rp67.500 	 Rp44.500 	 Rp59.000 	 Rp54.500 		 Rp47.000 		 Rp80.000 	 Rp80.000 	 Rp80.000 	 Rp80.000 	 Rp90.000 			 Rp90.000 	 Rp90.000 	 Rp90.000 	 Rp90.000 	 Rp90.000 		
 03 Pulsa, Apartement, Parkir																															
 04 Shopee		 Rp164.000 		 Rp114.000 	 Rp2.612.390 								 Rp164.000 	 Rp530.000 																	
 05 Listrik & PDAM																															
 06 Untuk Orang Tua		 Rp100.000 																													
 07 Persembahan			 Rp200.000 							 Rp200.000 							 Rp200.000 							 Rp200.000 							 Rp200.000 
 08 Kado																															
 09 Olah raga						 Rp16.000 		 Rp116.500 	 Rp298.000 			 Rp595.500 			 Rp97.000 	 Rp150.000 															
 10 Expense X									 Rp70.000 						 Rp575.000 																
 11 Expense X																															
 13 Expense X																															
																															
 Total Daily	 Rp- 	 Rp1.310.600 	 Rp330.000 	 Rp403.500 	 Rp2.750.890 	 Rp178.500 	 Rp148.500 	 Rp329.000 	 Rp593.000 	 Rp306.500 	 Rp67.500 	 Rp681.000 	 Rp235.000 	 Rp769.500 	 Rp845.000 	 Rp330.000 	 Rp200.000 	 Rp80.000 	 Rp80.000 	 Rp80.000 	 Rp80.000 	 Rp90.000 	 Rp- 	 Rp200.000 	 Rp90.000 	 Rp90.000 	 Rp90.000 	 Rp90.000 	 Rp90.000 	 Rp- 	 Rp200.000 
 Monthly expense Total	 Rp10.738.490 
`;

const monthMap = {
  "Jan": "01",
  "Feb": "02",
  "Mar": "03",
  "Apr": "04",
  "May": "05",
};

const categoryMap = {
  "01 Makan dan Minum": "Makan & Minum",
  "02 Transport": "Transport",
  "03 Pulsa, Apartement, Parkir": "Apartemen/Kost",
  "04 Shopee": "Belanja (Shopee)",
  "05 Listrik & PDAM": "Listrik & PDAM",
  "06 Untuk Orang Tua": "Untuk Orang Tua",
  "07 Persembahan": "Persembahan",
  "08 Kado": "Kado",
  "09 Expense X": "Lainnya",
  "10 Expense X": "Lainnya",
  "11 Expense X": "Lainnya",
  "12 Expense X": "Lainnya",
  "13 Expense X": "Lainnya",
  "09 Olah raga": "Olahraga"
};

const lines = raw.split('\n');
let currentYear = "2026";
let currentMonth = "01";

let sql = ""; // Remove BEGIN TRANSACTION

function parseAmount(str) {
  if (!str || !str.trim()) return 0;
  let s = str.replace(/Rp/g, '').replace(/\./g, '').trim();
  if (s === '-' || s === '') return 0;
  return parseInt(s, 10) || 0;
}

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  const monthMatch = line.match(/^(Jan|Feb|Mar|Apr|May)\s+(\d{4})/);
  if (monthMatch) {
    currentMonth = monthMap[monthMatch[1]];
    currentYear = monthMatch[2];
    continue;
  }
  
  if (line.startsWith('Expense Category') || line.startsWith('Total Daily') || line.startsWith('Monthly expense')) {
    continue;
  }
  
  const cols = line.split('\t');
  if (cols.length < 2) continue;
  
  const rawCat = cols[0].trim();
  const category = categoryMap[rawCat] || "Lainnya";
  
  for (let i = 1; i < cols.length; i++) {
    const amount = parseAmount(cols[i]);
    if (amount > 0) {
      const day = String(i).padStart(2, '0');
      const dateStr = currentYear + "-" + currentMonth + "-" + day;
      const uuid = crypto.randomUUID();
      sql += "INSERT INTO transactions (id, type, amount, category, date, note, user_id) VALUES ('" + uuid + "', 'expense', " + amount + ", '" + category + "', '" + dateStr + "', 'Excel History', 'ricky');\n";
    }
  }
}
// Remove COMMIT

fs.writeFileSync('history.sql', sql);
console.log("File history.sql berhasil dibuat!");
