"use client"

import React, {useState} from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    getFilteredRowModel
} from "@tanstack/react-table"
import {Input} from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    LucideSearch
} from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<any>([])

    const customFilterFn = (row: any, columnId: string, filterValue: string) => {
        if (!filterValue.length) return row
        return row.original.name?.toLowerCase().includes(filterValue.toLowerCase()) || row.original.symbol?.toLowerCase().includes(filterValue.toLowerCase())
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: customFilterFn, //'includesString',
        state: {
            sorting,
            globalFilter
        },
    })

    const [isSearchActive, setIsSearchActive] = useState(false)


    return (<>
        <div className="flex items-center justify-between mb-4 gap-4">
            {!isSearchActive && (<div>
                <h1>AssetTracker</h1>
                <p className="text-sm text-gray-500">Track your favourite crypto assets</p>
            </div>)}

            <LucideSearch
                className="h-8 w-8"
                onClick={() => setIsSearchActive(!isSearchActive)}
            />

            {isSearchActive && <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={e => table.setGlobalFilter(String(e.target.value))}
                className="w-full"
            />}
        </div>

        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="bg-secondary rounded"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </>)
}
