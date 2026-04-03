import { cn } from "../../lib/utils";
import { useMemo, useState } from "react";
import { ArrowUpDown, BadgeCheck, BadgeX, ChevronDown, ChevronUp, Eye, Printer, Search, SquareArrowLeft, SquareArrowRight, SquarePen, Trash } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "./table"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { AlertBox, AlertBoxContainer, AlertBoxTrigger } from "./AlertBox";
import { Button } from "./button"
import { Input } from "./input";

const getNestedValue = (obj, path) => {
  if (!path) return "";
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * 
 * @param {*} param0 
 * @returns 
 * data
 * columns
 * actions e.g. ["edit", "delete", "view"]
 * actionsDetaille e.g. delete: {
      type: "delete",
      icon: Trash,
      title: "",
      description: "Êtes-vous sûr de vouloir supprimer cette donnée ?",
      cancelText: "Annuler",
      actionText: "Supprimer",
      onOk: () => { return true },
      onCancel: () => { return false },
    }
  * onAction Callback function: (type, row) => void
  * variant => blue, dark, green, slate, light, outline
  * pageSize
  * isLoading
  * enableSearch = false,
  * enableSorting = false,
  * enableSelection = false,
  * onSelectionChange = (selectedRows) => {}
 */

const MyTable = ({
  data = [],
  columns,
  actions = [],
  actionsDetaille = {},
  onAction,
  variant = "slate",
  pageSize = 5,
  isLoading = false,

  enableSearch = false,
  enableSorting = false,
  enableSelection = false,
  onSelectionChange = (selectedRows) => { }
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic


  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 1. Handling Search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const val = getNestedValue(row, col.accessor);
        return String(val).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key);
      const bVal = getNestedValue(b, sortConfig.key);
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedData.length) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const allIds = new Set(sortedData.map(row => row.id));
      setSelectedIds(allIds);
      onSelectionChange(sortedData);
    }
  };

  const toggleSelectRow = (id, row) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);

    const selectedRows = data.filter(r => newSelected.has(r.id));
    onSelectionChange(selectedRows);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

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
    <div className={styles.container.rootdiv}>
      {enableSearch && (
        <div className="flex items-center justify-end py-4 w-full px-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 rounded-xl border-slate-200 focus:ring-slate-900"
            />
          </div>
        </div>
      )}
      <div className={styles.container.subrootdiv}>
        <Table>
          <MyTableHeader
            columns={columns}
            actions={actions.length > 0}
            variant={variants[variant]}
            enableSorting={enableSorting}
            sortConfig={sortConfig}
            requestSort={requestSort}
            enableSelection={enableSelection}
            onSelectAll={toggleSelectAll}
            allSelected={sortedData.length > 0 && selectedIds.size === sortedData.length}
          />

          <MyTableBody
            data={paginatedData}
            columns={columns}
            actions={actions}
            actionsDetaille={actionsDetaille}
            onAction={onAction}
            isLoading={isLoading}
            enableSelection={enableSelection}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelectRow}
          />

          <MyTableFooter
            totalDataCount={sortedData.length}
            colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
            startIndex={startIndex}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </Table>
      </div>
    </div>
  )
}

const MyTableHeader = ({ columns, variant, actions = false, enableSorting, sortConfig, requestSort, enableSelection, onSelectAll, allSelected }) => (
  <TableHeader className={variant}>
    <TableRow className={styles.header.tablehead}>
      {enableSelection && (
        <TableHead className="w-12 px-4">
          <Input type="checkbox" value={allSelected} onClick={onSelectAll} />
        </TableHead>
      )}
      {columns.map((column) => (
        <TableHead
          key={column.header}
          className={cn(styles.header.tablecell, variant, enableSorting && "cursor-pointer select-none")}
          onClick={() => enableSorting && requestSort(column.accessor)}
        >
          <div className="flex items-center gap-2">
            {column.header}
            {enableSorting && (
              sortConfig.key === column.accessor ? (
                sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              ) : <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </div>
        </TableHead>
      ))}
      {actions && (
        <TableHead
          key="actions"
          className={cn(styles.header.tablecell, "text-right", variant)}
        >
          Actions
        </TableHead>
      )}
    </TableRow>
  </TableHeader>
)

const MyTableBody = ({ data, isLoading, columns, actions, onAction, actionsDetaille, enableSelection, selectedIds, onToggleSelect }) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className={styles.body.tableloading.cell}>
            <div className={styles.body.tableloading.container}>
              <div className={styles.body.tableloading.spinner}></div>
              <p className={styles.body.tableloading.text}>Chargement...</p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="h-32 text-center text-slate-400 italic">
            Aucune donnée disponible
          </TableCell>
        </TableRow>
      ) : (
        data.map((row, index) => (
          <MyTableRow
            key={row.id || index}
            row={row}
            columns={columns}
            actions={actions}
            onAction={onAction}
            actionsDetaille={actionsDetaille}
            isItemSelected={selectedIds.has(row.id)}
            enableSelection={enableSelection}
            onToggleSelect={onToggleSelect}
          />
        ))
      )}
    </TableBody>
  )
}

const MyTableRow = ({ row, columns, actions, onAction, actionsDetaille, isItemSelected, enableSelection, onToggleSelect }) => {
  const ignoreColor = ["#FFFFFF", "#FFF", "#000000", "#000", "transparent"];
  const rowColor = row.color || row["color_code"];
  let iStyle = rowColor && !ignoreColor.includes(rowColor.toUpperCase());
  const rowClasses = cn(
    `odd:bg-white even:bg-slate-50/30`,
    "transition-colors hover:bg-slate-100/50"
  );
  const deleteAlertInfo = {
    type: "delete",
    ...actionsDetaille.delete
  }
  return (
    <TableRow
      key={row.id}
      className={cn(rowClasses, "transition-colors hover:bg-slate-100/50")}
    >
      {enableSelection && (
        <TableCell className="px-4">
          <Input
            type="checkbox"
            value={isItemSelected}
            onClick={() => onToggleSelect(row.id, row)}
          />
        </TableCell>
      )}
      {columns.map((column, colIndex) => {
        const value = getNestedValue(row, column.accessor);
        const cellStyle = (colIndex === 0 && iStyle)
          ? { backgroundColor: rowColor }
          : {};
        return (
          <TableCell key={column.accessor} style={cellStyle} className={cn(colIndex === 0 && iStyle && "font-medium")}>
            {typeof value === "boolean" ? (
              value ? <BadgeCheck className="text-emerald-600" /> : <BadgeX className="text-slate-300" />
            ) : value}
          </TableCell>
        )
      })}
      {actions.length > 0 && (
        <TableCell key="actions" className={styles.body.tablebody.cell}>
          {actions.includes("view") && (
            <ActionToolTip
              Icon={Eye}
              tip="Détails"
              onAction={() => onAction("view", row)}
              triggerStyle="text-emerald-600"
            />
          )}
          {actions.includes("edit") && (
            <ActionToolTip
              Icon={SquarePen}
              tip="Modifier"
              onAction={() => onAction("edit", row)}
              triggerStyle={"text-blue-600 hover:text-blue-900 transition-colors"}
            />
          )}
          {actions.includes("imp") && (
            <ActionToolTip
              Icon={Printer}
              tip="Imprimer"
              onAction={() => onAction("imp", row)}
              triggerStyle={"text-slate-600 hover:text-slate-900 transition-colors"}
            />
          )}
          {actions.includes("delete") && (
            <ActionToolTip
              row={row}
              Icon={Trash}
              tip="Supprimer"
              onAction={() => onAction("delete", row)}
              triggerStyle={"text-red-400 hover:text-red-600 transition-colors"}
              alertInfo={deleteAlertInfo}
              hasAlert
            />
          )}
        </TableCell>
      )}
    </TableRow>
  )
}

const ActionToolTip = ({ Icon, tip, onAction, triggerStyle, hasAlert, alertInfo, row }) => {
  const content = (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={!hasAlert ? onAction : undefined} className={cn("p-2 transition-transform active:scale-95", triggerStyle)}>
          <Icon size={18} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-slate-900 text-white">{tip}</TooltipContent>
    </Tooltip>
  );

  if (hasAlert) {
    return (
      <AlertBox>
        <AlertBoxTrigger asChild>
          <button
            onClick={!hasAlert ? onAction : undefined}
            className={cn("p-2 transition-transform active:scale-95", triggerStyle)}
          >
            <Icon size={18} />
          </button>
        </AlertBoxTrigger>
        <AlertBoxContainer
          type={alertInfo?.type}
          title={alertInfo.title}
          description={alertInfo.description}
          cancelText={alertInfo.cancelText}
          actionText={alertInfo.actionText}
          onOk={() => alertInfo.onOk(row)}
          onCancel={() => alertInfo.onCancel()}
        />
      </AlertBox>
    );
  }
  return content;
};

const MyTableFooter = ({ colSpan, startIndex, pageSize, totalDataCount, currentPage, setCurrentPage, totalPages }) => {
  return (
    <TableFooter>
      <TableCell colSpan={colSpan} className={styles.body.tablebody.cell}>
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            {startIndex + 1} de {Math.min(startIndex + pageSize, totalDataCount)} sur {totalDataCount}
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
      </TableCell>
    </TableFooter>
  )
}

const styles = {
  container: {
    rootdiv: "space-y-4 max-w-90 overflow-auto m-3",
    subrootdiv: "rounded-md border border-slate-200 overflow-hidden",
  },
  header: {
    tablehead: "hover:bg-transparent border-none",
    tablecell: "font-bold",
  },
  body: {
    tablebody: {
      cell: "text-right space-x-2",
      actions: "text-center",
      delete: "text-red-600",
    },
    tableloading: {
      cell: "h-32 text-center",
      container: "flex flex-col items-center justify-center space-y-2",
      spinner: "w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin",
      text: "text-slate-500 font-medium italic",
    }
  }
}

export { MyTable }
