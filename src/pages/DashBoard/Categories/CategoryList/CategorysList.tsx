import { useState, useEffect } from "react";
import { FiBox, FiPlus, FiSearch } from "react-icons/fi";
import "./CategorysList.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandBitbucket } from "react-icons/tb";
import IMAGE from "../../../../../data/DRY_FRUITS.png";
import Table, {
  TableColumn,
  PaginationData,
  ActionCallbacks,
  Badge,
  IconText,
} from "../../../../assets/table/Table";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import { CategoryService } from "../../../../service/category";
import Loader2 from "../../../../assets/loader/Loader2";
import StatisticCard from "../../../../assets/ui/StatisticCard/StatisticCard";

interface CategoryData {
  id: string;
  slNo: string;
  name: { name: string; image: any };
  brandsCount: number;
  productsCount: number;
  disableEdit?: boolean;
  disableDelete?: boolean;
}

const categoriesColumns: TableColumn<CategoryData>[] = [
  { key: "slNo", label: "SL. NO", width: "6.5%", align: "center" },
  {
    key: "name",
    label: "NAME",
    width: "24.5%",
    align: "center",
    renderCell: (value) => <IconText image={value.image} text={value.name} />,
  },
  {
    key: "brandsCount",
    label: "BRANDS COUNT",
    width: "23%",
    align: "center",
    renderCell: (value) => <Badge text={`${value} Brands`} />,
  },
  {
    key: "productsCount",
    label: "PRODUCTS COUNT",
    width: "23%",
    align: "center",
    renderCell: (value) => <>{value} items</>,
  },
  { key: "actions", label: "ACTIONS", width: "23%", align: "center" },
];

const PER_PAGE = 5;

const CategoriesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<CategoryData[]>([]);
  const [rawCategoriesData, setRawCategoriesData] = useState<CategoryData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [brandsCount, setBrandsCount] = useState<number>(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const responseData = await new CategoryService().getCategoriesWithBrandsAndProducts();
        let mapped: CategoryData[] = [];
        if (responseData?.length > 0) {
          let index = 0;
          let brandsCount = 0;
          let productsCount = 0;
          for (const response of responseData) {
            brandsCount = brandsCount + (response.brands?.length ?? 0);
            productsCount = productsCount + (response.products?.length ?? 0);
            mapped.push({
              id: response.catgeory.id,
              slNo: `${index + 1}`,
              name: { name: response.catgeory.name, image: IMAGE },
              brandsCount: response.brands?.length ?? 0,
              productsCount: response.products?.length ?? 0
            });
            index++;
          }
          setCategoriesCount(index);
          setBrandsCount(brandsCount);
          setProductsCount(productsCount);
        }
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
          el.name?.name?.toLowerCase().includes(query)
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
    // onDelete: (id) => console.log(`Delete category ${id}`),
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
              View, Search, And Manage Your Categories.
            </p>
          </div>

          <div className="category-list-statistic-card">
            <StatisticCard
              title="Total Categories"
              value={categoriesCount}
              icon={<MdOutlineCategory />}
              showBackground={true}
            />
            <StatisticCard
              title="Total Brands"
              value={brandsCount}
              icon={<TbBrandBitbucket />}
              showBackground={true}
            />
            <StatisticCard
              title="Total Products"
              value={productsCount}
              icon={<FiBox />}
              showBackground={true}
            />
          </div>

          <div className="table-actions-header">
            <div className="search-bar-wrapper">
              <DashBoardInput
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e)}
                icon={<FiSearch />}
                showBorder={true}
              />
            </div>
            <div className="action-btn-wrapper">
              <DashBoardButton
                icon={<FiPlus size={25} />}
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
            isSearch={searchQuery}
          />

        </div>
      )}
    </>
  );
};

export default CategoriesList;