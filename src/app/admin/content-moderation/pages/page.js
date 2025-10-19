"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FileText, Pencil } from "lucide-react"

// --- Static Page Data ---
// Define the data for the static pages
const staticPages = [
    {
        id: 1,
        name: "Landing Page",
        slug: "/",
        lastUpdated: "2025-09-29",
        // Example URL for editing (e.g., in a dashboard environment)
        editUrl: "/dashboard/content/edit/landing"
    },
    {
        id: 2,
        name: "Privacy Policy",
        slug: "/privacy-policy",
        lastUpdated: "2025-09-20",
        editUrl: "/dashboard/content/edit/privacy-policy"
    },
    {
        id: 3,
        name: "Terms and Conditions",
        slug: "/terms-conditions",
        lastUpdated: "2025-09-20",
        editUrl: "/dashboard/content/edit/terms-conditions"
    },
];

const PageContentManagement = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest block'>Page Content Management</span>
            <div className="overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="min-w-[200px]">Page Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Last Updated</TableHead>
                            <TableHead className="text-center w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticPages.map((page) => (
                            <TableRow key={page.id}>
                                <TableCell className="font-medium text-gray-500">{page.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <span className="font-semibold text-gray-800">{page.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-blue-600">{page.slug}</TableCell>
                                <TableCell className="text-right text-sm text-gray-600">{page.lastUpdated}</TableCell>
                                <TableCell className="text-center">
                                    {/* Use a framework's Link component here (e.g., Next.js/React Router) */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-primary border-primary hover:bg-primary/10 hover:text-background"
                                        onClick={() => {
                                            // Placeholder for actual navigation
                                            alert(`Redirecting to edit page for: ${page.name} at ${page.editUrl}`);
                                        }}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default PageContentManagement