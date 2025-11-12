import { useState } from 'react';

export default function Home() {
  const [filters, setFilters] = useState({ dept: '', coursenum: '', area: '', title: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/regoverviews?${query}`);
    const data = await res.json();
    if (data.ok) setResults(data.data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">📚 Registrar Search</h1>

      <form onSubmit={handleSearch} className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl space-y-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['dept','coursenum','area','title'].map(key => (
            <input
              key={key}
              placeholder={key.toUpperCase()}
              value={filters[key]}
              onChange={e => setFilters({ ...filters, [key]: e.target.value })}
              className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
        >
          {loading ? 'Searching...' : 'Search Classes'}
        </button>
      </form>

      <div className="mt-10 w-full max-w-5xl">
        <table className="min-w-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {['Class ID','Dept','Course #','Area','Title'].map(h => (
                <th key={h} className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-500">No results yet</td></tr>
            ) : (
              results.map(r => (
                <tr key={r.classid} className="hover:bg-blue-50 transition">
                  <td className="py-2 px-4 text-blue-600 font-medium">
                    <a href={`/details/${r.classid}`}>{r.classid}</a>
                  </td>
                  <td className="py-2 px-4">{r.dept}</td>
                  <td className="py-2 px-4">{r.coursenum}</td>
                  <td className="py-2 px-4">{r.area}</td>
                  <td className="py-2 px-4">{r.title}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
