import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { BadgeCheck, BadgeX, Eye, Printer, SquareArrowLeft, SquareArrowRight, SquarePen, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, striped, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-emerald-50 data-[state=selected]:bg-muted",
      striped && "odd:bg-white even:bg-slate-200",
      className
    )}
    {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props} />
))
TableCaption.displayName = "TableCaption"


const CustomDataTable = ({
  data,
  columns,
  actions = [], // e.g., ["edit", "delete", "view"]
  onAction,      // Callback function: (type, row) => void
  variant = "blue",
  pageSize = 5
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  // Color Variant Mapping
  const variants = {
    blue: "bg-blue-600 text-white",
    dark: "bg-slate-900 text-white",
    green: "bg-emerald-600 text-white",
  };

  return (
    <div className="space-y-4 max-w-90 overflow-auto">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className={variants[variant]}>
            <TableRow className="hover:bg-transparent border-none">
              {columns.map((col) => (
                <TableHead key={col.header} className="text-white font-bold">
                  {col.header}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="text-white font-bold text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => {
              const rowBackground = row.color
                ? row.color
                : "odd:bg-white even:bg-slate-50/50";
              return (
                <TableRow key={rowIndex} striped={row.color ? false : true} className={cn(rowBackground, "transition-colors hover:bg-muted/30")}>
                  {columns.map((col) => (
                    <TableCell key={col.accessor}>
                      {row[col.accessor]}
                      {typeof (row[col.accessor]) === "boolean" && (row[col.accessor] ? <BadgeCheck className="text-green-900" /> : <BadgeX className="text-red-900" />)}
                    </TableCell>
                  ))}
                  {/* Dynamic Actions Cell */}
                  {actions.length > 0 && (
                    <TableCell className="text-right space-x-2">
                      {actions.includes("view") && (
                        <Tooltip >
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onAction("view", row)}
                              className="text-emerald-500 hover:underline text-sm font-medium"
                            >
                              {/* View */}
                              <Eye className="w-4 h-4 mr-1 inline" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>détails</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {actions.includes("edit") && (
                        <Tooltip >
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onAction("edit", row)}
                              className="text-blue-500 hover:underline text-sm font-medium"
                            >
                              {/* Edit */}
                              <SquarePen className="w-4 h-4 mr-1 inline" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modifier</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {actions.includes("imp") && (
                        <Tooltip >
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onAction("imp", row)}
                              className="text-green-500 hover:underline text-sm font-medium"
                            >
                              {/* Imprimer */}
                              <Printer className="w-4 h-4 mr-1 inline" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Imprimer</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {actions.includes("delete") && (
                        <Tooltip >
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onAction("delete", row)}
                              className="text-red-500 hover:underline text-sm font-medium"
                            >
                              {/* Delete */}
                              <Trash className="w-4 h-4 mr-1 inline" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          {startIndex + 1} de {Math.min(startIndex + pageSize, data.length)} sur {data.length}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <SquareArrowLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <SquareArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};


export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  CustomDataTable
}
