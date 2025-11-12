import { useState } from 'react';

export default function Home() {
  const [filters, setFilters] = useState({ dept: '', coursenum: '', area: '', title: '' });
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/regoverviews?${query}`);
    const data = await res.json();
    if (data.ok) setResults(data.data);
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Registrar - Class Overviews</h1>
      <form onSubmit={handleSearch} className="space-x-2">
        {['dept','coursenum','area','title'].map(key => (
          <input key={key}
                 placeholder={key}
                 value={filters[key]}
                 onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                 className="border px-2 py-1" />
        ))}
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Search</button>
      </form>

      <table className="mt-4 border-collapse border w-full">
        <thead><tr><th>Class ID</th><th>Dept</th><th>Course #</th><th>Area</th><th>Title</th></tr></thead>
        <tbody>
          {results.map(r => (
            <tr key={r.classid}>
              <td><a href={`/details/${r.classid}`}>{r.classid}</a></td>
              <td>{r.dept}</td>
              <td>{r.coursenum}</td>
              <td>{r.area}</td>
              <td>{r.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
