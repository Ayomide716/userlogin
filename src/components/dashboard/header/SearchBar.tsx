import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = [
        { id: 1, title: "Dashboard Overview", type: "page", path: "/dashboard" },
        { id: 2, title: "Profile Settings", type: "settings", path: "/settings" },
        { id: 3, title: "Notifications", type: "notifications" },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      if (results.length > 0) {
        toast.info(`Found ${results.length} results`);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <input
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      {searchResults.length > 0 && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                if (result.path) {
                  navigate(result.path);
                } else {
                  toast.info(`Navigating to ${result.title}`);
                }
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              {result.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}