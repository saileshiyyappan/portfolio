const fs = require('fs');
const path = require('path');
const order = JSON.parse(fs.readFileSync('src/content/projects/project_order.json','utf8'));
const slugs = order.projects || [];
const issues = [];
slugs.forEach(slug => {
  const base = path.join('src','content','projects',slug);
  let gallery = {};
  try { gallery = JSON.parse(fs.readFileSync(path.join(base,'gallery.json'),'utf8')); } catch(e) {}
  ['galleryImages','architectureImages','flowcharts','screenshots','prototypeImages'].forEach(k=>{
    const arr = Array.isArray(gallery[k]) ? gallery[k] : [];
    arr.forEach((it, idx) => {
      if (!it || typeof it.src !== 'string' || it.src.trim() === '') {
        issues.push({ slug, file: 'gallery.json', collection: k, index: idx, src: it ? it.src : undefined });
      }
    });
  });

  let project = {};
  try { project = JSON.parse(fs.readFileSync(path.join(base,'project.json'),'utf8')); } catch(e) {}
  if (Array.isArray(project.galleryImages)) {
    project.galleryImages.forEach((it, idx) => {
      if (!it || typeof it.src !== 'string' || it.src.trim() === '') {
        issues.push({ slug, file: 'project.json', collection: 'galleryImages', index: idx, src: it ? it.src : undefined });
      }
    });
  }

  if (project.coverImage && typeof project.coverImage.src !== 'string') {
    issues.push({ slug, file: 'project.json', collection: 'coverImage', src: project.coverImage.src });
  }
});

if (issues.length) console.log(JSON.stringify(issues, null, 2)); else console.log('No missing src issues');
