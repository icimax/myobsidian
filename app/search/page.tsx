export default function SearchPage() {
  return (
    <div className="min-h-screen pt-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Recherche</h1>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <input 
            type="text" 
            placeholder="Rechercher dans vos notes..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
