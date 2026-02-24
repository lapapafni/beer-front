  export const renderScoreBar = (score: number) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-4 h-4 rounded-full ${i < score ? 'bg-amber-500' : 'bg-gray-700'}`}></div>
      ))}
    </div>
  );
