import React from "react";
import Table, {
  TableColumn,
  PaginationData,
  ActionCallbacks,
  Badge,
  IconText,
} from "../../../assets/table/Table";
import { FaSeedling, FaCoffee, FaLeaf } from "react-icons/fa";

interface CategoryData {
  id: number;
  slNo: string;
  categoryId: string;
  name: { text: string; icon: "seed" | "coffee" | "leaf" };
  brandsCount: number;
  productsCount: number;
}

const categoriesColumns: TableColumn<CategoryData>[] = [
  { key: "slNo", label: "SL. NO", width: "5%", align: "center" },
  { key: "categoryId", label: "CATEGORY ID", width: "15%" },
  {
    key: "name",
    label: "NAME",
    width: "30%",
    renderCell: (value) => <IconText iconName={value.icon} text={value.text} />,
  },
  {
    key: "brandsCount",
    label: "BRANDS COUNT",
    width: "15%",
    align: "center",
    renderCell: (value) => <Badge text={`${value} Brands`} />,
  },
  {
    key: "productsCount",
    label: "PRODUCTS COUNT",
    width: "15%",
    align: "center",
    renderCell: (value) => <>{value} items</>,
  },
  { key: "actions", label: "ACTIONS", width: "10%", align: "center" },
];

const handleEdit = (id: any) => console.log(`Edit category ${id}`);
const handleDelete = (id: any) => console.log(`Delete category ${id}`);
const categoriesActions: ActionCallbacks = {
  onEdit: handleEdit,
  onDelete: handleDelete,
};

const categoriesDataList: CategoryData[] = [
  {
    id: 1,
    slNo: "01",
    categoryId: "CAT - 8821",
    name: { text: "Organic Grains", icon: "seed" },
    brandsCount: 12,
    productsCount: 248,
  },
  {
    id: 2,
    slNo: "02",
    categoryId: "CAT - 8822",
    name: { text: "Artisan Blends", icon: "coffee" },
    brandsCount: 8,
    productsCount: 112,
  },
  {
    id: 3,
    slNo: "03",
    categoryId: "CAT - 7732",
    name: { text: "Herbal Extracts", icon: "leaf" },
    brandsCount: 24,
    productsCount: 503,
  },
  {
    id: 4,
    slNo: "04",
    categoryId: "CAT - 4490",
    name: { text: "Cold-Pressed Oils", icon: "seed" },
    brandsCount: 5,
    productsCount: 88,
  },
  {
    id: 5,
    slNo: "05",
    categoryId: "CAT - 1209",
    name: { text: "Sustainable Spices", icon: "seed" },
    brandsCount: 18,
    productsCount: 422,
  },
];

const pagination: PaginationData = {
  currentPage: 1,
  totalEntries: 24,
  perPage: 5,
  onPageChange: (page) => console.log(`Go to page ${page}`),
};

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
// Adjust paths based on your structure
import "./CategoryList.css"; // Import the new CSS file
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";

const CategoriesPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesData, setCategoriesData] =
    useState<any[]>(categoriesDataList);

  // Mock data/columns for illustration...
  const paginationData = {
    currentPage: 1,
    totalEntries: 0,
    perPage: 10,
    onPageChange: () => {},
  };

  useEffect(() => {
    if (searchQuery?.trim()) {
      let filteredData = categoriesDataList.filter(
        (el) =>
          el.slNo?.toLowerCase().includes(searchQuery) ||
          el.categoryId?.toLowerCase().includes(searchQuery) ||
          el.name?.text?.toLowerCase().includes(searchQuery),
      );
      console.log({ searchQuery, categoriesData, filteredData });
      setCategoriesData(filteredData);
    } else {
      console.log({ searchQuery, categoriesData });
      setCategoriesData(categoriesDataList);
    }
    // fetchDataFromBackend(searchQuery);
  }, [searchQuery]);

  return (
    <div className="admin-page-container">
      {/* Page Header Area (Optional, but good for admin pages) */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories Management</h1>
        <p className="admin-page-subtitle">
          View, search, and manage your product categories.
        </p>
      </div>

      {/* The Actions Header (Search & Add) */}
      <div className="table-actions-header">
        <div className="search-bar-wrapper">
          <DashBoardInput
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e)}
            icon={<FiSearch />}
          />
        </div>
        {/* <div className="action-btn-wrapper">
          <DashBoardButton
            name="Add Category"
            variant="primary"
            onClick={() => {}}
          />
        </div> */}
      </div>

      {/* The Dumb Table */}
      {/* <Table 
        columns={categoriesColumns} 
        data={data} 
        pagination={paginationData}
      /> */}
      <Table<CategoryData>
        width="100%"
        columns={categoriesColumns}
        data={categoriesData}
        actions={categoriesActions}
        pagination={pagination}
        idField="id" // Specify the primary key for action buttons
      />
    </div>
  );
};

export default CategoriesPage;

// const CategoryList = () => {
//   return (
//     <div>
//     </div>
//   );
// };

// export default CategoryList;
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
