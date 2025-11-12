import { useRouter } from 'next/router';
import useSWR from 'swr';
const fetcher = url => fetch(url).then(r => r.json());

export default function Details() {
  const { query } = useRouter();
  const { data, error } = useSWR(query.classid ? `/api/regdetails?classid=${query.classid}` : null, fetcher);

  if (error) return <p className="text-center text-red-500 mt-10">Error loading details</p>;
  if (!data) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (data.error) return <p className="text-center text-red-500 mt-10">{data.error}</p>;

  const d = data.data[0];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
        <a href="/" className="text-blue-600 hover:underline">← Back</a>
        <h1 className="text-3xl font-bold mt-4 mb-2">{d.title}</h1>
        <p className="text-gray-600 mb-4">{d.area} • {d.dept} {d.coursenum}</p>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Days:</strong> {d.days}</p>
          <p><strong>Time:</strong> {d.starttime} – {d.endtime}</p>
          <p><strong>Location:</strong> {d.bldg} {d.roomnum}</p>
          <p><strong>Professor:</strong> {d.profname}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{d.descrip}</p>
        </div>
      </div>
    </div>
  );
}
