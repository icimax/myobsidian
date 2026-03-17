import { getAllNotes } from '@/lib/notes';
import Link from 'next/link';

export default function Sidebar() {
  const notes = getAllNotes();

  return (
    <aside className="sidebar">
      <ul className="sidebar-list"  >
        {notes.map((note) => (
          <li key={note.slug} className='sidebar-item'>
            <Link href={`/${note.slug}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}