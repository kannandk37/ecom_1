import React from "react";
import {
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "./Table.css";

interface BadgeProps {
  text: string;
  style?: React.CSSProperties
}

export const Badge: React.FC<BadgeProps> = ({ text, style }) => (
  <span className="badge" style={style}>{text}</span>
);

interface IconTextProps {
  image?: any;
  text?: string;
  imageStyle?: React.CSSProperties
}

export const IconText: React.FC<IconTextProps> = ({ image, text, imageStyle }) => (
  <div className="icon-text-wrapper">
    {image && (
      <div className="icon-wrapper">
        <img src={image} style={imageStyle} className="icon-image-wrapper" />
      </div>
    )}
    {text && <span className="text-wrapper">{text}</span>}
  </div>
);

export interface ActionCallbacks {
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
}

interface ActionCellProps {
  id: any;
  callbacks: ActionCallbacks;
  disableEdit?: boolean;
  disableDelete?: boolean;
}

const ActionCell: React.FC<ActionCellProps> = ({
  id,
  callbacks,
  disableEdit,
  disableDelete,
}) => (
  <div className="action-cell">
    {callbacks.onEdit && (
      <button
        className="action-btn edit-btn"
        onClick={() => callbacks.onEdit?.(id)}
        disabled={disableEdit}
      >
        <FiEdit className="action-icon" />
      </button>
    )}
    {callbacks.onDelete && (
      <button
        className="action-btn delete-btn"
        onClick={() => callbacks.onDelete?.(id)}
        disabled={disableDelete}
      >
        <FiTrash2 className="action-icon" />
      </button>
    )}
  </div>
);

export interface PaginationData {
  currentPage: number;
  totalEntries: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

interface PaginationProps {
  data: PaginationData;
}

const Pagination: React.FC<PaginationProps> = ({ data }) => {
  const { currentPage, totalEntries, perPage, onPageChange } = data;
  const totalPages = Math.ceil(totalEntries / perPage);
  const showingFrom = (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, totalEntries);

  if (totalPages <= 0) return null;

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="pagination-wrapper">
      <p className="pagination-showing">
        Showing {showingFrom} to {showingTo} of {totalEntries} entries
      </p>
      <div className="pagination-pages">
        <button
          className="page-btn nav-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft className="nav-icon" />
        </button>
        {
          getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`page-btn ${page === currentPage ? "active" : ""}`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )
          )
        }
        <button
          className="page-btn nav-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight className="nav-icon" />
        </button>
      </div>
    </div>
  );
};

export interface TableColumn<T> {
  key: keyof T | "actions";
  label: string;
  renderCell?: (value: any, row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableProps<T> {
  width?: string;
  height?: string;
  columns: TableColumn<T>[];
  data: T[];
  actions?: ActionCallbacks;
  pagination?: PaginationData;
  idField?: keyof T; // e.g. 'id', used to identify row for actions.
  isSearch?: string;
}

const Table = <T extends Record<string, any>>({
  width = "100%",
  height,
  columns,
  data,
  actions,
  pagination,
  idField = "id" as keyof T, // Default to 'id' if not provided
  isSearch

}: TableProps<T>) => {
  const tableStyle = {
    width,
    ...(height && { height, overflow: "auto" }),
  };

  return (
    <div className="table-wrapper" style={tableStyle}>
      <div className="table-scroll-container">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={col.align ? `align-${col.align}` : ""}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="table-empty-state">
                    {isSearch ? `No Search Data` : `No Data`}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={String(row[idField])}
                    className={rowIndex % 2 !== 0 ? "even-row" : ""}
                  >
                    {columns.map((col) => {
                      const isActions = col.key === "actions";
                      const cellValue = row[col.key as string];
                      return (
                        <td
                          key={col.key as string}
                          className={col.align ? `align-${col.align}` : ""}
                        >
                          {isActions && actions ? (
                            <ActionCell
                              id={row[idField]}
                              callbacks={actions}
                              disableEdit={row.disableEdit}
                              disableDelete={row.disableDelete}
                            />
                          ) : col.renderCell ? (
                            col.renderCell(cellValue, row)
                          ) : (
                            cellValue
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
      </div>
      {pagination && data.length > 0 && <Pagination data={pagination} />}
    </div>
  );
};

export default Table;