import fs from 'fs';
import chalk from 'chalk';

const saveData = async (data, page) => {
  const savePath = new URL(`../../data/${page}.json`, import.meta.url).pathname;

  return new Promise((resolve, reject) => {
    fs.readFile(savePath, 'utf8', (err, existingData) => {
      if (err && err.code !== 'ENOENT') {
        return reject(err);
      }

      let jsonData = [];

      if (existingData) {
        try {
          jsonData = JSON.parse(existingData);
        } catch (parseError) {
          return reject(parseError);
        }
      }

      jsonData.push(...data);

      fs.writeFile(savePath, JSON.stringify(jsonData), (writeErr) => {
        if (writeErr) {
          console.log(writeErr)
          return reject(writeErr);
        }

        console.log('File was saved: ' + chalk.blue(savePath));
        resolve();
      });
    });
  });
};

export { saveData };