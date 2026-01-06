import { Pencil, Trash2 } from "lucide-react";

const banners = [
  {
    id: 1,
    image: "https://via.placeholder.com/600x200?text=Banner+1",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/600x200?text=Banner+2",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/600x200?text=Banner+3",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/600x200?text=Banner+4",
  },
];

export default function HomeBanners() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Home Slider Banners</h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
          ADD HOME SLIDE
        </button>
      </div>

      {/* ===== Table Card ===== */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm text-gray-700">
            <tr>
              <th className="px-6 py-3">IMAGE</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {banners.map((banner) => (
              <tr key={banner.id}>
                {/* Image Column */}
                <td className="px-6 py-4">
                  <img
                    src={banner.image}
                    alt="Banner"
                    className="h-24 w-[420px] object-cover rounded-md border"
                  />
                </td>

                {/* Action Column */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">
                    <button className="text-gray-600 hover:text-blue-600 transition">
                      <Pencil size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-red-600 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
