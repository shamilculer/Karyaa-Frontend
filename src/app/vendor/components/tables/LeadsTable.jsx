"use client"

import * as React from "react"
import Link from "next/link"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    EllipsisVertical,
    Search,
    ChevronDown,
} from "lucide-react"

import {
    IconCircleFilled,
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react"


const sampleData = [
    {
        id: 546,
        clientName: "Ayman Malik",
        contactNumber: "+971 5993 00 0934",
        eventType: "Wedding",
        eventDate: "15/OCT/2025",
        eventLocation: "Ajman, UAE",
        status: "Open",
    },
    {
        id: 272,
        clientName: "Sana Khan",
        contactNumber: "+971 5567 89 0123",
        eventType: "Birthday Party",
        eventDate: "20/NOV/2025",
        eventLocation: "Dubai, UAE",
        status: "In Progress",
    },
    {
        id: 903,
        clientName: "Omar Hassan",
        contactNumber: "+971 5012 34 5678",
        eventType: "Corporate Event",
        eventDate: "05/DEC/2025",
        eventLocation: "Abu Dhabi, UAE",
        status: "Closed",
    },
    {
        id: 174,
        clientName: "Fatima Al-Mansoori",
        contactNumber: "+971 5023 45 6789",
        eventType: "Anniversary Celebration",
        eventDate: "10/JAN/2026",
        eventLocation: "Sharjah, UAE",
        status: "Open",
    },
    {
        id: 875,
        clientName: "Khalid bin Rashid",
        contactNumber: "+971 5678 90 1234",
        eventType: "Gala Dinner",
        eventDate: "25/FEB/2026",
        eventLocation: "Dubai, UAE",
        status: "Open",
    },
    {
        id: 236,
        clientName: "Amira Said",
        contactNumber: "+971 5534 56 7890",
        eventType: "Product Launch",
        eventDate: "12/MAR/2026",
        eventLocation: "Ras Al Khaimah, UAE",
        status: "In Progress",
    },
    {
        id: 107,
        clientName: "Youssef Ibrahim",
        contactNumber: "+971 5098 76 5432",
        eventType: "Team Building",
        eventDate: "01/APR/2026",
        eventLocation: "Fujairah, UAE",
        status: "Closed",
    },
    {
        id: 878,
        clientName: "Layla Abdullah",
        contactNumber: "+971 5876 54 3210",
        eventType: "Charity Auction",
        eventDate: "08/MAY/2026",
        eventLocation: "Umm Al Quwain, UAE",
        status: "In Progress",
    },
    {
        id: 679,
        clientName: "Hamad Al Fares",
        contactNumber: "+971 5611 22 3344",
        eventType: "Exhibition",
        eventDate: "15/JUN/2026",
        eventLocation: "Ajman, UAE",
        status: "Open",
    },
    {
        id: 110,
        clientName: "Noora Ahmed",
        contactNumber: "+971 5044 33 2211",
        eventType: "Art Gallery Opening",
        eventDate: "22/JUL/2026",
        eventLocation: "Sharjah, UAE",
        status: "In Progress",
    },
];

const baseColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "clientName",
        header: "Client Name",
        cell: ({ row }) => (
            <Link href={`/leads/${row.original.id}`} className="hover:underline hover:text-blue-600">
                {row.original.clientName}
            </Link>
        ),
    },
    {
        accessorKey: "contactNumber",
        header: "Contact Number",
    },
    {
        accessorKey: "eventType",
        header: "Event Type",
    },
    {
        accessorKey: "eventDate",
        header: "Event Date",
    },
    {
        accessorKey: "eventLocation",
        header: "Event Location",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            let statusColor;
            if (status === "Open") {
                statusColor = "bg-green-100 text-green-800";
            } else if (status === "In Progress") {
                statusColor = "bg-blue-100 text-blue-800";
            } else {
                statusColor = "bg-red-100 text-red-800";
            }
            return (
                <Badge
                    variant="outline"
                    className={`inline-flex items-center border-0 gap-1.5 rounded-full px-2 !py-1 text-xs font-medium leading-0 ${statusColor}`}
                >
                    <IconCircleFilled className="size-2 fill-current" />
                    <span className="mt-1">{status}</span>
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted flex size-8 border border-gray-400 !outline-0"
                        size="icon"
                    >
                        <EllipsisVertical className="w-5 text-gray-600" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32 bg-white">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function LeadsTable({ controls = true }) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 8,
    });
    const [globalFilter, setGlobalFilter] = React.useState('');

    // Conditionally add the checkbox column
    const columns = React.useMemo(() => {
        if (!controls) {
            return baseColumns;
        }

        const checkboxColumn = {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected() ? true : undefined}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                    <span className="ml-2 font-medium text-[#727272]">No.</span>
                </div>
            ),
            cell: ({ row, table }) => {
                const { pageSize, pageIndex } = table.getState().pagination;
                const rowNumber = pageSize * pageIndex + row.index + 1;
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                        <span className="text-sm text-gray-700">{rowNumber}</span>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        };

        return [checkboxColumn, ...baseColumns];
    }, [controls]);

    const table = useReactTable({
        data: sampleData,
        columns,
        state: {
            rowSelection,
            pagination,
            globalFilter,
        },
        enableRowSelection: !!controls,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const filteredData = React.useMemo(() => {
        if (!globalFilter) {
            return sampleData;
        }
        const lowerCaseFilter = globalFilter.toLowerCase();
        return sampleData.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(lowerCaseFilter)
            )
        );
    }, [globalFilter, sampleData]);

    table.options.data = filteredData;

    const selectedRowCount = Object.keys(rowSelection).length;

    return (
        <div className="w-full">
            {controls && (
                <div className="flex justify-between items-center gap-4 py-4">
                    <div className="relative">
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <span>Bulk Actions</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white">
                                    <DropdownMenuItem onClick={() => {}}>
                                        Move
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {}}>
                                        Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {}}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <div className="relative w-3/4 md:w-1/2 lg:w-2/5">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4" />
                        <Input
                            placeholder="Search by client name, event type, or location..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="w-full bg-white border-gray-300 h-11 pl-10"
                        />
                    </div>
                </div>
            )}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden">
                    <Table className="border-0 w-full">
                        <TableHeader className="sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="font-medium text-[#727272]">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="bg-white">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {controls && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <IconChevronLeft className="size-4" />
                        </Button>
                        {Array.from({ length: table.getPageCount() }, (_, i) => (
                            <Button
                                key={i}
                                variant={i === table.getState().pagination.pageIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => table.setPageIndex(i)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <IconChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
