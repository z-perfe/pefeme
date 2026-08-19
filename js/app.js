// Minimal markdown blog: fetches .md files with a small YAML-ish frontmatter block
// and renders them client-side with marked.js. No build step required.
// Single page (index.html): shows the post list, or a single article when a
// `?slug=` query param is present, all driven by posts.json.

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  match[1].split('\n').forEach((line) => {
    const m = line.match(/^([A-Za-z_]+):\s*"?(.*?)"?\s*$/);
    if (m) meta[m[1]] = m[2];
  });

  return { meta, body: match[2] };
}

async function fetchPostsIndex() {
  const res = await fetch('posts.json');
  if (!res.ok) throw new Error('无法加载文章列表');
  return res.json();
}

async function fetchPostMarkdown(slug) {
  const res = await fetch(`posts/${slug}.md`);
  if (!res.ok) throw new Error('文章不存在');
  return parseFrontmatter(await res.text());
}

async function renderList(container) {
  document.title = 'Pefe.me';
  try {
    const posts = await fetchPostsIndex();
    container.innerHTML = posts.filter((p) => !p.hidden).map((p) => `
      <a class="post-card" href="index.html?slug=${encodeURIComponent(p.slug)}">
        <h2>${p.title}</h2>
        <div class="meta">${p.date}${p.category ? ' · ' + p.category : ''}</div>
        <div class="desc">${p.description}</div>
      </a>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

async function renderArticle(container, slug) {
  try {
    const { meta, body } = await fetchPostMarkdown(slug);
    document.title = `${meta.title || slug} - Pefe.me`;

    container.innerHTML = `
      <div class="article-header">
        <h1>${meta.title || slug}</h1>
        <div class="article-meta">${meta.date || ''}${meta.category ? ' · ' + meta.category : ''}</div>
      </div>
      ${meta.image ? `<img class="article-image" src="${meta.image}" alt="${meta.title || ''}">` : ''}
      <div class="article-body">${marked.parse(body)}</div>
      <a class="back-link" href="index.html">&larr; 返回文章列表</a>
    `;
  } catch (err) {
    container.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function renderApp() {
  const container = document.getElementById('content');
  const slug = new URLSearchParams(location.search).get('slug');

  if (slug) {
    renderArticle(container, slug);
  } else {
    renderList(container);
  }
}
