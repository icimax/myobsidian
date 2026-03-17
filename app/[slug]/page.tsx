// src/app/[slug]/page.tsx
import { getAllNotes, getNoteData, getGraphData } from '@/lib/notes';
import Link from 'next/link';
import { RxCross2 } from "react-icons/rx";

// Génération des pages statiques au build
export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

// Typage des props de la page
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NotePage({ params }: PageProps) {
  // Dans Next.js 15, params est une Promise, il faut l'await
  const { slug } = await params;
  
  const noteData = await getNoteData(slug);
  const graphData = getGraphData();
  const title = noteData?.title && noteData.title.length > 16 ? noteData.title.slice(0,14) + '...' : noteData?.title || '';
  if (!noteData) {
    return <div className="text-white p-10">Note introuvable</div>;
  }

  return (
    <section>
      <section className='head'>
        <div className="ligne1"></div>
        <div className='encoche'>
          <p className='encoche-title'>{title}</p>
          <Link href="/" className="no-underline text-sm text-gray-500 hover:text-purple-400">
            <RxCross2 className="close-note"/>
          </Link>
        </div>
        <div className="ligne2"></div>
      </section>
      
      <article className="min-h-screen text-gray-200 p-6 lg:col-span-2 prose prose-invert prose-purple max-w-none">
        
        {noteData.date && <p className="text-gray-500 text-sm mb-2">{noteData.date}</p>}
        {noteData.title && <h2 className="text-E5E6EA mb-8">{noteData.title}</h2>}
        <div dangerouslySetInnerHTML={{ __html: noteData.contentHtml || '' }} />
      </article>
    </section>
  );
}