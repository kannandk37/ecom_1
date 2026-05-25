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
}

export const Badge: React.FC<BadgeProps> = ({ text }) => (
  <span className="badge">{text}</span>
);

interface IconTextProps {
  image?: any;
  text: string;
}

export const IconText: React.FC<IconTextProps> = ({ image, text }) => (
  <div className="icon-text-wrapper">
    {image && (
      <div className="icon-wrapper">
        <img src={image} className="icon-image-wrapper" />
      </div>
    )}
    <span className="text-wrapper">{text}</span>
  </div>
);

// Definition for action callbacks
export interface ActionCallbacks {
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
}

interface ActionCellProps {
  id: any;
  callbacks: ActionCallbacks;
}

const ActionCell: React.FC<ActionCellProps> = ({ id, callbacks }) => (
  <div className="action-cell">
    {callbacks.onEdit && (
      <button
        className="action-btn edit-btn"
        onClick={() => callbacks.onEdit?.(id)}
      >
        <FiEdit className="action-icon" />
      </button>
    )}
    {callbacks.onDelete && (
      <button
        className="action-btn delete-btn"
        onClick={() => callbacks.onDelete?.(id)}
      >
        <FiTrash2 className="action-icon" />
      </button>
    )}
  </div>
);

// Definition for pagination data
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

  const pageNumbers = [];
  // Basic pagination, shows all pages. More advanced logic would involve ellipses.
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
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

// Generic Column Definition
export interface TableColumn<T> {
  key: keyof T | "actions";
  label: string;
  renderCell?: (value: any, row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string; // e.g. '10%'
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
    ...(height && { height, overflow: "auto" }), // Make table body scrollable if height is set
  };

  return (
    <div className="table-wrapper" style={tableStyle}>
      <div className="table-scroll-contrainer">
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
                  <tr key={rowIndex} className={rowIndex % 2 !== 0 ? "even-row" : ""}>
                    {columns.map((col) => {
                      const isActions = col.key === "actions";
                      const cellValue = row[col.key as string];

                      return (
                        <td
                          key={col.key as string}
                          className={col.align ? `align-${col.align}` : ""}
                        >
                          {isActions && actions ? (
                            <ActionCell id={row[idField]} callbacks={actions} />
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