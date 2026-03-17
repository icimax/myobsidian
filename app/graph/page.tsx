import Graph from '@/components/graph';
import { getAllNotes, getGraphData } from '@/lib/notes';

export default function GraphPage() {
  const notes = getAllNotes();
  const graphData = getGraphData();
  return (
    <div className="min-h-screen">
        <div className="h-full w-full">
          <Graph data={graphData} />
        </div>
    </div>
  );
}
