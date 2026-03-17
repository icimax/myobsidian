'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GraphData } from '@/lib/notes'; // L'import fonctionne grâce au tsconfig

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="p-4 text-gray-500">Chargement du graph...</div>
});

export default function Graph({ data }: { data: GraphData }) {
  const router = useRouter();

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        nodeColor={() => "#a78bfa"}
        linkColor={() => "#555"}
        backgroundColor="#111827"
        onNodeClick={(node) => {
          if (node.id) {
            router.push(`/${node.id}`);
          }
        }}
      />
    </div>
  );
}
