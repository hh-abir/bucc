type Column = {
  header: string;
  accessorKey: string;
  cell?: (context: { getValue: () => any; row: any }) => React.ReactNode;
};

const getValue = (row: any, path: string) =>
  path.split(".").reduce((value, key) => (value == null ? value : value[key]), row);

export default function TableComponent({
  data = [],
  columns,
  onRowClick,
}: {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th key={column.accessorKey} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={columns.length}>
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row._id ?? row.id ?? index}
                  className={`border-b border-border last:border-0 ${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.accessorKey} className="px-4 py-3 align-top">
                      {column.cell
                        ? column.cell({ getValue: () => getValue(row, column.accessorKey), row })
                        : String(getValue(row, column.accessorKey) ?? "N/A")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
