import React from "react"
import { cn } from "@/lib/utils"

export interface GlassTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
}

export interface GlassTableProps<T> {
  columns: GlassTableColumn<T>[]
  data: T[]
  striped?: boolean
  className?: string
}

export function GlassTable<T extends Record<string, unknown>>({
  columns,
  data,
  striped = false,
  className,
}: GlassTableProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{
                    fontSize: 10.5,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    padding: "9px 13px",
                    textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    fontWeight: 500,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  "group",
                  striped && rowIdx % 2 === 1 && "[&>td]:[background:rgba(255,255,255,0.02)]"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="group-hover:[background:rgba(255,255,255,0.025)!important] transition-colors duration-150"
                    style={{
                      fontSize: 12.5,
                      color: "rgba(255,255,255,0.7)",
                      padding: "11px 13px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
