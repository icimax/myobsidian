import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// On pointe vers le dossier 'content' à la racine
const contentDirectory = path.join(process.cwd(), 'content');

export interface Note {
  slug: string;
  title: string;
  date?: string;
  contentHtml?: string;
  [key: string]: any;
}

export interface GraphNode {
  id: string;
  name: string;
  val?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const cleanSlug = (text: string): string => text.replace(/\.md$/, '').toLowerCase().replace(/\s+/g, '-');

export function getAllNotes(): Note[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const fileNames = fs.readdirSync(contentDirectory);
  
  return fileNames.filter(f => f.endsWith('.md')).map((fileName) => {
    const slug = cleanSlug(fileName);
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date,
      ...data,
    };
  });
}

export async function getNoteData(slug: string): Promise<Note | null> {
  if (!fs.existsSync(contentDirectory)) return null;
  const fileNames = fs.readdirSync(contentDirectory);
  const fileName = fileNames.find(fn => cleanSlug(fn) === slug);
  
  if (!fileName) return null;

  const fullPath = path.join(contentDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const contentWithLinks = content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    const [target, alias] = p1.split('|');
    const targetSlug = cleanSlug(target);
    return `<a href="/${targetSlug}" class="internal-link">${alias || target}</a>`;
  });

  const processedContent = await remark().use(html).process(contentWithLinks);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: data.title || slug,
    date: data.date,
    ...data,
  };
}

export function getGraphData(): GraphData {
  if (!fs.existsSync(contentDirectory)) return { nodes: [], links: [] };
  const fileNames = fs.readdirSync(contentDirectory).filter(f => f.endsWith('.md'));
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  fileNames.forEach((fileName) => {
    const slug = cleanSlug(fileName);
    nodes.push({ id: slug, name: slug });
  });

  fileNames.forEach((fileName) => {
    const sourceSlug = cleanSlug(fileName);
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const regex = /\[\[(.*?)\]\]/g;
    let match;
    while ((match = regex.exec(fileContents)) !== null) {
      const targetRaw = match[1].split('|')[0];
      const targetSlug = cleanSlug(targetRaw);
      if (nodes.find(n => n.id === targetSlug)) {
        links.push({ source: sourceSlug, target: targetSlug });
      }
    }
  });

  return { nodes, links };
}