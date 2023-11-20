const fs = require('fs');
const path = require('path');
const axios = require('axios');

function extractLinks(content) {
  const matches = content.match(/{%\s*embed\s*url="([^"]+)"/g) || [];
  return matches.map(match => match.match(/"([^"]+)"/)[1]);
}

async function checkLink(link, file) {
  try {
    console.log(`Checking link: ${link} in file: ${file}`);
    await axios.get(link);
    console.log(`Link is reachable: ${link}`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Link is broken (404): ${link} in file: ${file}`);
      // You can add your own logic here to handle or delete the file containing the broken link
    } else {
      console.error(`Failed to load link: ${link} in file: ${file}`);
    }
  }
}

function checkAllLinks() {
  const mdFiles = fs.readdirSync(process.cwd()).filter(file => file.endsWith('.md'));

  mdFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content);

    links.forEach(async (link) => {
      await checkLink(link, file);
    });
  });
}

checkAllLinks();
