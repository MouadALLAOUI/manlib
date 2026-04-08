import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { BadgeCheck, BadgeX, Eye, Printer, SquareArrowLeft, SquareArrowRight, SquarePen, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { AlertBox, AlertBoxTrigger, AlertBoxContainer } from "./AlertBox"

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
      "border-b transition-colors hover:bg-slate-50 data-[state=selected]:bg-muted",
      striped && "odd:bg-white even:bg-slate-50/50",
      className
    )}
    {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle text-slate-700 [&:has([role=checkbox])]:pr-0", className)}
    {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-slate-500", className)}
    {...props} />
))
TableCaption.displayName = "TableCaption"


const CustomDataTable = ({
  data = [],
  columns,
  actions = [], // e.g., ["edit", "delete", "view"]
  actionsDetaille = {
    delete: {
      type: "delete",
      icon: Trash,
      title: "",
      description: "Êtes-vous sûr de vouloir supprimer cette donnée ?",
      cancelText: "Annuler",
      actionText: "Supprimer",
      onOk: () => { return true },
      onCancel: () => { return false },
    }
  },
  onAction,      // Callback function: (type, row) => void
  variant = "slate",
  pageSize = 5,
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Pagination Logic
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = Array.isArray(data) ? data.slice(startIndex, startIndex + pageSize) : [];

  // Color Variant Mapping
  const variants = {
    blue: "bg-blue-600 text-white",
    dark: "bg-slate-900 text-white",
    green: "bg-emerald-600 text-white",
    slate: "bg-slate-900 text-white",
    light: "bg-slate-100 text-slate-900",
    outline: "bg-white border-b border-slate-200 text-slate-900",
  };

  return (
    <div className="space-y-4 max-w-90 overflow-auto">
      <div className="rounded-md border border-slate-200 overflow-hidden">
        <h1>Switch to Mytable is for the final product</h1>
        <Table>
          <TableHeader className={variants[variant]}>
            <TableRow className="hover:bg-transparent border-none">
              {columns.map((col) => (
                <TableHead key={col.header} className={cn("font-bold", variant === "slate" ? "text-white" : "text-slate-900")}>
                  {col.header}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className={cn("font-bold text-right", variant === "slate" ? "text-white" : "text-slate-900")}>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium italic">Chargement des données...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="h-32 text-center">
                  <p className="text-slate-500 font-medium italic">Aucune donnée trouvée</p>
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, rowIndex) => {
                const ignoreColor = ["#FFFFFF", "#FFF", "#000000", "#000", "transparent"];
                const rowColor = row.color || row["color_code"];
                let iStyle = false
                if (rowColor && !ignoreColor.includes(rowColor.toUpperCase())) {
                  iStyle = true
                } else {
                  iStyle = false
                }
                const rowClasses = cn(
                  `odd:bg-white even:bg-slate-50/30`,
                  "transition-colors hover:bg-slate-100/50"
                );
                return (
                  <TableRow key={rowIndex} striped={iStyle ? false : true} style={iStyle ? { backgroundColor: rowColor } : {}} className={cn(rowClasses, "transition-colors hover:bg-slate-100/50")}>
                    {columns.map((col) => (
                      <TableCell key={col.accessor}>
                        {row[col.accessor]}
                        {typeof (row[col.accessor]) === "boolean" && (row[col.accessor] ? <BadgeCheck className="text-slate-900" /> : <BadgeX className="text-slate-400" />)}
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
                                className="text-emerald-600 hover:text-emerald-900 transition-colors"
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
                                className="text-blue-600 hover:text-blue-900 transition-colors"
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
                                className="text-slate-600 hover:text-slate-900 transition-colors"
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
                              <AlertBox>
                                <AlertBoxTrigger asChild>
                                  <button
                                    onClick={() => onAction("delete", row)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    {/* Delete */}
                                    <Trash className="w-4 h-4 mr-1 inline" />
                                  </button>
                                </AlertBoxTrigger>
                                <AlertBoxContainer
                                  type="delete"
                                  title={actionsDetaille.delete.title}
                                  description={actionsDetaille.delete.description}
                                  cancelText={actionsDetaille.delete.cancelText}
                                  actionText={actionsDetaille.delete.actionText}
                                  onOk={() => actionsDetaille.delete.onOk(row)}
                                  onCancel={() => actionsDetaille.delete.onCancel()}
                                />
                              </AlertBox>
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
              })
            )}
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
