'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import JobCard from './JobCard';
import { Button } from '@/components/ui/button';

const CareersClient = ({ jobs }) => {
    // Search constraints
    const [searchWhat, setSearchWhat] = useState('');

    // Filter selections
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedTypesOfWork, setSelectedTypesOfWork] = useState([]);

    // Department search text
    const [deptSearch, setDeptSearch] = useState('');

    // Mobile filter state
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Derived metadata: available departments and countries across ALL jobs
    const allDepartments = useMemo(() => {
        const counts = {};
        jobs.forEach(job => {
            const dept = job.department || 'Uncategorized';
            counts[dept] = (counts[dept] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [jobs]);

    const allTypesOfWork = useMemo(() => {
        const counts = {};
        jobs.forEach(job => {
            const typeOfWork = job.typeOfWork || 'Unspecified';
            counts[typeOfWork] = (counts[typeOfWork] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [jobs]);

    // Apply Filters
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            // Match text searches
            const whatMatch = !searchWhat ||
                job.title?.toLowerCase().includes(searchWhat.toLowerCase()) ||
                job.body?.toLowerCase().includes(searchWhat.toLowerCase());

            // Match checkboxes
            const deptMatch = selectedDepartments.length === 0 ||
                selectedDepartments.includes(job.department || 'Uncategorized');

            const typeOfWorkMatch = selectedTypesOfWork.length === 0 ||
                selectedTypesOfWork.includes(job.typeOfWork || 'Unspecified');

            return whatMatch && deptMatch && typeOfWorkMatch;
        });
    }, [jobs, searchWhat, selectedDepartments, selectedTypesOfWork]);

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchWhat, selectedDepartments, selectedTypesOfWork]);

    // Paginate
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredJobs.length / pageSize);

    // Visible departments (filtered by deptSearch)
    const visibleDepartments = allDepartments.filter(d =>
        d.name.toLowerCase().includes(deptSearch.toLowerCase())
    );

    const toggleDepartment = (dept) => {
        setSelectedDepartments(prev =>
            prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
        );
    };

    const toggleTypeOfWork = (typeOfWork) => {
        setSelectedTypesOfWork(prev =>
            prev.includes(typeOfWork) ? prev.filter(t => t !== typeOfWork) : [...prev, typeOfWork]
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 items-start mt-8">

            {/* Mobile Filter Overlay */}
            {isMobileFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileFilterOpen(false)}
                />
            )}

            {/* Sidebar Filters */}
            <aside className={`fixed inset-y-0 right-0 z-50 w-[300px] max-w-full bg-white p-6 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-1/4 lg:max-w-none lg:p-0 lg:bg-transparent lg:translate-x-0 lg:block lg:shrink-0 ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="flex items-center justify-between mb-6 lg:block lg:mb-6">
                    <h3 className="!text-xl uppercase font-medium text-gray-900 mb-0 lg:mb-6">Filters</h3>
                    <button
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        onClick={() => setIsMobileFilterOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-8 lg:space-y-8">
                    {/* Department Filter Box */}
                    <div className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                            <h4 className="!text-sm font-semibold text-gray-900 mb-3 uppercase">Department Name</h4>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                                    value={deptSearch}
                                    onChange={(e) => setDeptSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {visibleDepartments.length > 0 ? (
                                visibleDepartments.map(dept => (
                                    <label key={dept.name} className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center pt-0.5">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                                                checked={selectedDepartments.includes(dept.name)}
                                                onChange={() => toggleDepartment(dept.name)}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none flex-1">
                                            {dept.name} ({dept.count})
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p className="!text-sm text-gray-500 italic">No departments match your search.</p>
                            )}
                        </div>
                    </div>

                    {/* Type of Work Filter Box */}
                    <div className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                            <h4 className="!text-sm font-semibold uppercase text-gray-900">Type of Work</h4>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {allTypesOfWork.map(type => (
                                <label key={type.name} className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center pt-0.5">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                                            checked={selectedTypesOfWork.includes(type.name)}
                                            onChange={() => toggleTypeOfWork(type.name)}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none flex-1">
                                        {type.name} ({type.count})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    </div>
            </aside>

            {/* Main Content */}
            <main className="w-full lg:flex-1 space-y-5">

                {/* Header Section */}
                <div>
                    <h2 className="!text-xl md:!text-3xl uppercase font-bold text-gray-900 mb-2">Opportunities at Karyaa</h2>
                    <p className="text-gray-700">Current Openings</p>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-3 border-b border-gray-300">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Job title or skill"
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-base"
                                value={searchWhat}
                                onChange={(e) => setSearchWhat(e.target.value)}
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>


                    <div className="w-full md:w-auto shrink-0 flex gap-2 items-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 lg:hidden flex items-center justify-center gap-2 py-2 h-auto"
                            onClick={() => setIsMobileFilterOpen(true)}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {(selectedDepartments.length > 0 || selectedTypesOfWork.length > 0) && (
                                <span className="bg-primary text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                                    {selectedDepartments.length + selectedTypesOfWork.length}
                                </span>
                            )}
                        </Button>

                        <div className="hidden md:block w-full md:w-auto space-y-2">
                            <label className="text-sm font-medium text-gray-700 block md:hidden">&nbsp;</label>
                            <Button className="w-full py-3 h-auto">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-500 font-medium pt-2">
                    Showing {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                </div>

                {/* Job List */}
                <div className="space-y-3">
                    {paginatedJobs.length > 0 ? (
                        paginatedJobs.map((job, idx) => (
                            <JobCard key={`job-${idx}`} job={job} />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="!text-lg font-medium text-gray-900 mb-2">No roles match your search</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => {
                                    setSearchWhat('');
                                    setSelectedDepartments([]);
                                    setSelectedTypesOfWork([]);
                                }}
                                className="mt-4 text-primary font-medium hover:underline inline-flex items-center gap-2"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8 mt-8 border-t border-gray-100">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="flex items-center gap-1 mx-4">
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const page = i + 1;
                                // Simple pagination: show first, last, and pages around current
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${currentPage === page
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    (page === 2 && currentPage > 3) ||
                                    (page === totalPages - 1 && currentPage < totalPages - 2)
                                ) {
                                    return <span key={page} className="px-2 text-gray-400">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CareersClient;
