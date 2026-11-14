import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  caption,
  toolbar,
  empty,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string | number;
  caption: string;
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface", className)}>
      {toolbar && <div className="border-b border-line p-4">{toolbar}</div>}
      {rows.length === 0 ? (
        <div className="p-4">{empty}</div>
      ) : (
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={`${caption} table, scrollable`}
          data-lenis-prevent
        >
          <Table>
            <caption className="sr-only">{caption}</caption>
            <TableHeader>
              <TableRow className="border-line hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    scope="col"
                    className={cn(
                      "h-10 bg-subtle px-4 text-[12px] font-semibold text-ink-muted first:rounded-tl-xl last:rounded-tr-xl",
                      column.className,
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={getKey(row)} className="border-line hover:bg-subtle/70">
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("px-4 py-3 text-[13px] text-ink", column.className)}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
