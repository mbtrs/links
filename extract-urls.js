const fs = require('fs');

const markdownFiles = ['./blogs.md', './cheatsheets.md']; // Add your Markdown files here

const extractedUrls = markdownFiles.reduce((urls, file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/{%\s*embed\s*url="([^"]+)"\s*%}/g);
  if (matches) {
    const fileUrls = matches.map(match => match.match(/"([^"]+)"/)[1]);
    return urls.concat(fileUrls);
  }
  return urls;
}, []);

fs.writeFileSync('extracted-links.txt', extractedUrls.join('\n'));
