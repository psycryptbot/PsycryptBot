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
const fLogger = logger.createSubProcess(`Filter`);
const basePath = path.join(__dirname, '../');
const pathSplitter = process.platform == 'win32' ? '\\' : '/';
const _header = fs.readFileSync(
    path.join(
        __dirname,
        'resources/HEADER.txt',
    ),
).toString();
const blacklist = fs.readFileSync(
    path.join(
        basePath,
        '.gitignore',
    ),
).toString().split('\n').map((val, idx, array) => {
  return val
      .replace(new RegExp(pathSplitter, 'g'), '')
      .replace(/\*/g, '')
      .replace(/#/g, '');
});


/**
 * Determines whether a file is in a blacklisted directory or possibly
 * a blacklisted file.
 *
 * @param {String} path
 * @return {Boolean}
 *    Returns true if blacklist is hit; False otherwise.
 */
function hitFilter(path) {
  fLogger.debug(`Checking ${item.path}`);
  if (!fs.statSync(path).isFile()) {
    fLogger.debug(`Filter: Not a file, returning`);
    return true;
  }
  const splitPath = path.split(pathSplitter);
  const chosen = blacklist > splitPath;
  const array = chosen ? splitPath : blacklist;

  for (let i = 0; i < array.length; i++) {
    const slice = array[i];
    if (chosen ? blacklist.includes(slice) : splitPath.includes(slice)) {
      fLogger.debug(`Hit blacklisted item`);
      return true;
    }
  }

  return false;
}

logger.log(`Starting Copyrighter`);

klaw(basePath, {
  depthLimit: Infinity,
  filter: (path) => {
    fLogger.debug(`Starting filter`);
    return !hitFilter(path);
  },
}).on('data', (item) => {
  let header = _header;
  if (path.extname(item.path) == '.js' || (() => {
    if (path.extname(item.path) == '.sol') {
      header = `// SPDX-License-Identifier: UNLICENCED\n${_header}`;
      return true;
    }
    return false;
  })()) {
    const fileName = path.basename(item.path);
    let fileString = fs.readFileSync(item.path, {encoding: 'utf-8'}).toString();
    if (fileString.length == 0) {
      logger.warn(`Found empty file: ${fileName}`);
      return;
    }
    if (fileString.startsWith(header)) {
      logger.debug(`Skipping ${fileName}, as header already exists`);
      return;
    } else if (fileString.startsWith('//\n')) {
      const splitFile = fileString.split('\n');
      splitFile.filter((item) => {
        return !(item == '// SPDX-License-Identifier: UNLICENCED');
      });
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
    fileString = `${header}\n${fileString}`;
    fs.writeFileSync(item.path, fileString, {encoding: 'utf-8'});
    logger.debug(`Finished with ${fileName}`);
  } else {
    logger.debug(`Not a supported file`);
  }
}).on('end', () => {
  logger.log(`Finished!`);
});
