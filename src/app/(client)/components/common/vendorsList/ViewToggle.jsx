"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const ViewToggle = ({ currentView = 'list' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleViewChange = (view) => {
    const params = new URLSearchParams(searchParams);
    
    if (view === 'list') {
      params.delete('view');
    } else {
      params.set('view', view);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-4xl p-1">
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('list')}
        className={`gap-2 ${
          currentView === 'list'
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="max-md:hidden">List</span>
      </Button>
      
      <Button
        variant={currentView === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('map')}
        className={`gap-2 ${
          currentView === 'map'
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100'
        }`}
      >
        <Map className="w-4 h-4" />
        <span className="max-md:hidden">Map</span>
      </Button>
    </div>
  );
};

export default ViewToggle;