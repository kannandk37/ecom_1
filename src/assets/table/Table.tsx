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
        <img src={image} className="icon-image-wrapper"/>
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
}

const Table = <T extends Record<string, any>>({
  width = "100%",
  height,
  columns,
  data,
  actions,
  pagination,
  idField = "id" as keyof T, // Default to 'id' if not provided
}: TableProps<T>) => {
  const tableStyle = {
    width,
    ...(height && { height, overflow: "auto" }), // Make table body scrollable if height is set
  };

  return (
    <div className="table-wrapper" style={tableStyle}>
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
          {data.map((row, rowIndex) => (
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
                      cellValue // Default: render value as text
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && <Pagination data={pagination} />}
    </div>
  );
};

export default Table;

// --- ILLUSTRATIVE EXAMPLE OF USAGE ---
// This would go in your parent component.

/*
import Table, { TableColumn, PaginationData, ActionCallbacks } from './components/Table/Table';
import { LeafIcon, CoffeeIcon, SeedlingIcon } from '@heroicons/react/24/outline';

// 1. Define your data type
interface CategoryData {
  id: number;
  slNo: string;
  categoryId: string;
  name: { text: string; icon: 'seed' | 'coffee' | 'leaf' };
  brandsCount: number;
  productsCount: number;
}

// 2. Define your columns with custom rendering
const categoriesColumns: TableColumn<CategoryData>[] = [
  { key: 'slNo', label: 'SL. NO', width: '5%', align: 'center' },
  { key: 'categoryId', label: 'CATEGORY ID', width: '15%' },
  { 
    key: 'name', 
    label: 'NAME', 
    width: '30%',
    renderCell: (value) => <IconText iconName={value.icon} text={value.text} />
  },
  { 
    key: 'brandsCount', 
    label: 'BRANDS COUNT', 
    width: '15%',
    align: 'center',
    renderCell: (value) => <Badge text={`${value} Brands`} />
  },
  { 
    key: 'productsCount', 
    label: 'PRODUCTS COUNT', 
    width: '15%',
    align: 'center',
    renderCell: (value) => <>{value} items</>
  },
  { key: 'actions', label: 'ACTIONS', width: '10%', align: 'center' },
];

// 3. Define action callbacks
const handleEdit = (id: any) => console.log(`Edit category ${id}`);
const handleDelete = (id: any) => console.log(`Delete category ${id}`);
const categoriesActions: ActionCallbacks = { onEdit: handleEdit, onDelete: handleDelete };

// 4. Data (e.g. from an API)
const categoriesData: CategoryData[] = [
  { id: 1, slNo: '01', categoryId: 'CAT - 8821', name: { text: 'Organic Grains', icon: 'seed' }, brandsCount: 12, productsCount: 248 },
  { id: 2, slNo: '02', categoryId: 'CAT - 9104', name: { text: 'Artisan Blends', icon: 'coffee' }, brandsCount: 8, productsCount: 112 },
  { id: 3, slNo: '03', categoryId: 'CAT - 7732', name: { text: 'Herbal Extracts', icon: 'leaf' }, brandsCount: 24, productsCount: 503 },
  { id: 4, slNo: '04', categoryId: 'CAT - 4490', name: { text: 'Cold-Pressed Oils', icon: 'seed' }, brandsCount: 5, productsCount: 88 },
  { id: 5, slNo: '05', categoryId: 'CAT - 1209', name: { text: 'Sustainable Spices', icon: 'seed' }, brandsCount: 18, productsCount: 422 },
];

// 5. Pagination Data
const pagination: PaginationData = {
  currentPage: 1,
  totalEntries: 24,
  perPage: 5,
  onPageChange: (page) => console.log(`Go to page ${page}`),
};

// 6. Final Usage
<Table<CategoryData>
  width="100%"
  columns={categoriesColumns}
  data={categoriesData}
  actions={categoriesActions}
  pagination={pagination}
  idField="id" // Specify the primary key for action buttons
/>
*/
