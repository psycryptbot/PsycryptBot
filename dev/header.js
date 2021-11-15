//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const Logger = require('../src/Logger');
const path = require('path');
const fs = require('fs');
const klaw = require('klaw');
const logger = new Logger('Copyrighter');
const basePath = path.join(__dirname, '../');
const header = fs.readFileSync(
    path.join(
        __dirname,
        'resources/HEADER.txt',
    ),
).toString();

logger.log(`Starting`);

klaw(basePath, {
  depthLimit: Infinity,
}).on('data', (item) => {
  if (item.path.includes('node_modules')) {
    return;
  }
  if (path.extname(item.path) == '.js') {
    const fileName = path.basename(item.path);
    let fileString = fs.readFileSync(item.path, {
      encoding: 'utf-8',
    }).toString();
    if (fileString.length == 0) {
      logger.warn(`Found empty javascript file: ${fileName}`);
      return;
    }
    if (fileString.startsWith(header)) {
      logger.debug(`Skipping ${fileName}, as header already exists`);
      return;
    } else if (fileString.startsWith('//\n')) {
      const splitFile = fileString.split('\n');
      for (let i = 0; i < splitFile.length; i++) {
        const line = splitFile[i];
        if (line.startsWith('//')) {
          splitFile.shift();
          if (line == '//\n') {
            break;
          }
        } else {
          splitFile.shift();
          break;
        }
      }
      splitFile.shift();
      fileString = splitFile.join('\n');
    }

    fileString = `${header}${fileString}`;
    fs.writeFileSync(item.path, fileString, {encoding: 'utf-8'});
    logger.debug(`Finished with ${fileName}`);
  }
}).on('end', () => {
  logger.log(`Finished!`);
});
