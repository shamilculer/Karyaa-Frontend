"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Search, Plus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCategoryDetails } from "@/app/actions/admin/categories";
import { AddCategoryModal } from "../components/modals/category/AddCategoryModal";

const CategoryManagementPage = () => {
  return (
    <div className="dashboard-container space-y-8">
      <Suspense fallback={<CategoriesLoadingSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </div>
  );
};

const CategoriesContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCategoryDetails();
      console.log(response);
      if (response.success) {
        setCategories(response.categories);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Memoize the filtering logic
  const filteredCategories = useMemo(() => {
    if (!searchQuery) {
      return categories;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return categories.filter((cat) => {
      // Search in category name and slug
      const matchesCategory =
        cat.name.toLowerCase().includes(lowerCaseQuery) ||
        cat.slug.toLowerCase().includes(lowerCaseQuery);

      // Search in subcategories names
      const matchesSubcategory = cat.subCategories?.some((sub) =>
        sub.name.toLowerCase().includes(lowerCaseQuery)
      );

      return matchesCategory || matchesSubcategory;
    });
  }, [searchQuery, categories]);

  if (isLoading) {
    return <CategoriesLoadingSkeleton />;
  }

  if (error) {
    return <ErrorUI message={error} onRetry={fetchCategories} />;
  }

  return (
    <div className="w-full space-y-6 mb-12">
      {/* Search Bar and Action Button */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-1/3 min-w-[300px]">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-gray-300 h-11 pl-10"
          />
        </div>

        <AddCategoryModal />
      </div>

      {/* Categories Grid */}
      <div className="w-full grid grid-cols-4 gap-8">
        {filteredCategories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}

        {filteredCategories.length === 0 && categories.length > 0 && (
          <div className="col-span-4 text-center py-10 text-lg text-gray-500">
            No categories found matching "{searchQuery}".
          </div>
        )}

        {categories.length === 0 && (
          <div className="col-span-4 text-center py-10 text-lg text-gray-500">
            No categories available. Add your first category to get started.
          </div>
        )}
      </div>
    </div>
  );
};

const CategoriesLoadingSkeleton = () => {
  return (
    <div className="w-full space-y-6 mb-12">
      {/* Search Bar and Action Button Skeleton */}
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="w-1/3 min-w-[300px] h-11" />
        <Skeleton className="w-40 h-10" />
      </div>

      {/* Categories Grid Skeleton */}
      <div className="w-full grid grid-cols-4 gap-8">
        {[...Array(8)].map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const CategoryCardSkeleton = () => {
  return (
    <Card className="p-4 px-0 border-gray-300 shadow-none">
      <CardContent className="p-0 px-3">
        <Skeleton className="w-full h-56 rounded-2xl" />
        <div className="px-2 mt-3 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-3 w-1/3" />
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-t-gray-300 flex items-center justify-end gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  );
};

const ErrorUI = ({ message, onRetry }) => {
  return (
    <div className="w-full space-y-6 mb-12">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-1/3 min-w-[300px]">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search categories by name or slug..."
            disabled
            className="w-full bg-white border-gray-300 h-11 pl-10"
          />
        </div>

        <Button asChild>
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </Link>
        </Button>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-red-900">
              Failed to Load Categories
            </h3>
            <p className="text-red-700 max-w-md">{message}</p>
          </div>
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Categories
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CategoryCard = ({ category }) => {
  return (
    <Card className="p-2 border-gray-200 shadow-none bg-white min-h-[500px] relative">
      <CardContent className="p-0">
        <div className="w-full h-52 relative">
          <Image
            fill
            className="object-cover rounded-xl"
            alt={category.name}
            src={category.coverImage || category.icon || "/placeholder.jpg"}
          />
        </div>
        <div className="px-2 mt-3">
          <h3 className="!text-[24px] mb-2">{category.name}</h3>

          <p className="text-sm font-heading font-medium text-gray-700 mb-2">
            Subcategories ({category.subCategories?.length || 0}):
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
            {category.subCategories?.slice(0, 3).map((sub) => (
              <li key={sub._id} className="truncate">
                {sub.name}
                <span className="text-gray-400 ml-1">
                  ({sub.vendorCount || 0})
                </span>
              </li>
            ))}
            {category.subCategories?.length > 3 && (
              <li className="list-none pl-4 text-gray-400">
                ...and {category.subCategories.length - 3} more
              </li>
            )}
          </ul>

          {/* Vendor Count Display */}
          <p className="!text-sm font-heading font-medium text-gray-700 mt-2">
            Total Vendors:
            <span className="text-primary font-semibold">
              {category.vendorCount || 0}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="!py-4 px-0 border-t border-t-gray-300 flex items-center justify-end gap-6 absolute w-[90%] bottom-0">
        <Button
          size="sm"
          className="bg-body text-primary border border-gray-300"
          asChild
        >
          <Link
            href={`/admin/category-management/${category.slug}`}
            className="flex items-center gap-1"
          >
            <Eye className="w-3.5" /> View More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryManagementPage;
