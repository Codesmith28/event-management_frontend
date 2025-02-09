interface FilterProps {
  filters: {
    title: string;
    category: string;
    startDate: string;
    endDate: string;
  };
  setFilters: (filters: any) => void;
}

export function EventFilter({ filters, setFilters }: FilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <input
        type="text"
        placeholder="Search by title"
        className="border p-2 rounded"
        value={filters.title}
        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
      />
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        <option value="conference">Conference</option>
        <option value="workshop">Workshop</option>
        <option value="seminar">Seminar</option>
      </select>
      <input
        type="date"
        className="border p-2 rounded"
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      />
      <input
        type="date"
        className="border p-2 rounded"
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      />
    </div>
  );
}
