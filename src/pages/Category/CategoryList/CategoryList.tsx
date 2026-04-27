import Table, {
  TableColumn,
  PaginationData,
  ActionCallbacks,
  Badge,
  IconText,
} from "../../../assets/table/Table";
import IMAGE from "../../../../data/DRY_FRUITS.png";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./CategoryList.css";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import { CategoryService } from "../../../service/category";
import Loader2 from "../../../assets/loader/Loader2";
import { useNavigate } from "react-router-dom";

interface CategoryData {
  id: number;
  slNo: string;
  categoryId: string;
  name: { text: string; image: any };
  brandsCount: number;
  productsCount: number;
}

const categoriesColumns: TableColumn<CategoryData>[] = [
  { key: "slNo", label: "SL. NO", width: "5%", align: "center" },
  {
    key: "name",
    label: "NAME",
    width: "30%",
    renderCell: (value) => <IconText image={value.image} text={value.text} />,
  },
  { key: "categoryId", label: "CATEGORY ID", width: "15%" },
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

const PER_PAGE = 5;

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [rawCategoriesData, setRawCategoriesData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const categories = await new CategoryService().get();
        const mapped = categories.map((el: any, index: number) => ({
          id: el.id,
          slNo: `${index + 1}`,
          name: { text: el.name, image: IMAGE },
          categoryId: el.subCategory?.name ?? "-",
          brandsCount: 24,
          productsCount: 503,
        }));
        setRawCategoriesData(mapped);
        setFilteredData(mapped);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const result = rawCategoriesData.filter(
        (el) =>
          el.slNo?.toLowerCase().includes(query) ||
          el.categoryId?.toLowerCase().includes(query) ||
          el.name?.text?.toLowerCase().includes(query)
      );
      setFilteredData(result);
    } else {
      setFilteredData(rawCategoriesData);
    }
    setCurrentPage(1);
  }, [searchQuery, rawCategoriesData]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / PER_PAGE);

  const pagedData = filteredData.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pagination: PaginationData = {
    currentPage,
    totalEntries,
    perPage: PER_PAGE,
    onPageChange: handlePageChange,
  };

  const categoriesActions: ActionCallbacks = {
    onEdit: (id) => navigate(`/dashboard/categories/edit/${id}`),
    onDelete: (id) => console.log(`Delete category ${id}`),
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="admin-page-container">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Categories Management</h1>
            <p className="admin-page-subtitle">
              View, search, and manage your product categories.
            </p>
          </div>

          <div className="table-actions-header">
            <div className="search-bar-wrapper">
              <DashBoardInput
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e)}
                icon={<FiSearch />}
              />
            </div>
            <div className="action-btn-wrapper">
              <DashBoardButton
                name="Add Category"
                variant="primary"
                onClick={() => navigate("/dashboard/categories/add")}
              />
            </div>
          </div>

          <Table<CategoryData>
            width="100%"
            columns={categoriesColumns}
            data={pagedData}
            actions={categoriesActions}
            pagination={pagination}
            idField="id"
          />
        </div>
      )}
    </>
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

// const categoriesDataList: CategoryData[] = [
//   {
//     id: 1,
//     slNo: "01",
//     categoryId: "CAT - 8821",
//     name: { text: "Organic Grains", icon: "seed" },
//     brandsCount: 12,
//     productsCount: 248,
//   },
//   {
//     id: 2,
//     slNo: "02",
//     categoryId: "CAT - 8822",
//     name: { text: "Artisan Blends", icon: "coffee" },
//     brandsCount: 8,
//     productsCount: 112,
//   },
//   {
//     id: 3,
//     slNo: "03",
//     categoryId: "CAT - 7732",
//     name: { text: "Herbal Extracts", icon: "leaf" },
//     brandsCount: 24,
//     productsCount: 503,
//   },
//   {
//     id: 4,
//     slNo: "04",
//     categoryId: "CAT - 4490",
//     name: { text: "Cold-Pressed Oils", icon: "seed" },
//     brandsCount: 5,
//     productsCount: 88,
//   },
//   {
//     id: 5,
//     slNo: "05",
//     categoryId: "CAT - 1209",
//     name: { text: "Sustainable Spices", icon: "seed" },
//     brandsCount: 18,
//     productsCount: 422,
//   },
// ];
