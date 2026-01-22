const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const INPUT_FILE = path.join(__dirname, 'input_countries.csv');
const CANADA_FILE = path.join(__dirname, 'canada.txt');
const USA_FILE = path.join(__dirname, 'usa.txt');
const HEADER = 'country,year,population\n';

const removeIfExists = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
    console.log(`Deleted existing ${path.basename(filePath)}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
};

const writeFilteredFiles = () =>
  new Promise((resolve, reject) => {
    const canadaStream = fs.createWriteStream(CANADA_FILE, { flags: 'a' });
    const usaStream = fs.createWriteStream(USA_FILE, { flags: 'a' });

    canadaStream.write(HEADER);
    usaStream.write(HEADER);

    fs.createReadStream(INPUT_FILE)
      .pipe(csv())
      .on('data', (row) => {
        const line = `${row.country},${row.year},${row.population}\n`;
        if (row.country === 'Canada') {
          canadaStream.write(line);
        } else if (row.country === 'United States') {
          usaStream.write(line);
        }
      })
      .on('end', () => {
        canadaStream.end();
        usaStream.end();
        console.log('Finished writing canada.txt and usa.txt');
        resolve();
      })
      .on('error', (err) => {
        canadaStream.destroy();
        usaStream.destroy();
        reject(err);
      });
  });

const main = async () => {
  await Promise.all([removeIfExists(CANADA_FILE), removeIfExists(USA_FILE)]);
  await writeFilteredFiles();
};

main().catch((err) => {
  console.error('Error processing CSV:', err);
  process.exit(1);
});
