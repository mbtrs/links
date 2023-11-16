
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function checkLinks() {
  try {
    const mdFiles = await exec('find . -type f -name "*.md"');
    const mdFileList = mdFiles.stdout.split('\n').filter(Boolean);

    const links = [];
    mdFileList.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(/{%\s*embed\s*url="\K[^"]*/g);
      if (matches) {
        links.push(...matches);
      }
    });

    for (const link of links) {
      console.log(`Checking link: ${link}`);
      await exec(`markdown-link-check "${link}" --config .markdown-link-check.json`);
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    process.exit(1);
  }
}

checkLinks();
