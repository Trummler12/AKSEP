const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseDir = path.join(__dirname, '..', 'src/de/Programm/lang');

function aggregate() {
  const agDirs = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());
  agDirs.forEach(agDir => {
    const agPath = path.join(baseDir, agDir.name);
    const entries = fs.readdirSync(agPath, { withFileTypes: true });
    entries.forEach(entry => {
      if (!entry.isDirectory()) return;
      const themeDir = path.join(agPath, entry.name);
      const chapterFiles = fs.readdirSync(themeDir).filter(f => f.endsWith('.md'));
      if (!chapterFiles.length) return;
      const chapters = chapterFiles.map(file => {
        const fullPath = path.join(themeDir, file);
        const src = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(src);
        return { data, content };
      }).sort((a, b) => a.data.kapitel_id - b.data.kapitel_id);
      const meta = chapters[0].data;
      const chapterContent = chapters.map(ch => {
        let body = ch.content.trim();
        if (body.startsWith('##')) {
          const lines = body.split('\n');
          lines.shift();
          body = lines.join('\n').trim();
        }
        return `## ${ch.data.kapitel}\n${body}`;
      }).join('\n\n');
      const full = matter.stringify(`# ${meta.thema}\n\n${chapterContent}\n`, {
        layout: 'layout.njk',
        ag: meta.ag,
        ag_id: meta.ag_id,
        thema: meta.thema,
        thema_id: meta.thema_id,
        tags: [meta.thema]
      });
      const outFile = path.join(agPath, `${entry.name}.md`);
      fs.writeFileSync(outFile, full);
      console.log(`Generated ${path.relative(baseDir, outFile)} from ${chapterFiles.length} chapters.`);
    });
  });
}

aggregate();
