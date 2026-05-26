import { useState, useEffect } from "react";
import { FiBox, FiPlus, FiSearch } from "react-icons/fi";
import "./WarehousesList.css";
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
import { WarehouseService } from "../../../../service/warehouse";

interface WarehouseData {
    id: string;
    name: string;
    totalWareHouseBins: number;
    totalCapacitySpace: number;
    totalAvailableSpace: number;
    totalOccupiedSpace: number;
    noOfProducts: number;
    operationalStatus: string;
    operatorName: string;
    contact: string;
    owershipType: string;
    disableEdit?: boolean;
    disableDelete?: boolean;
}

const categoriesColumns: TableColumn<WarehouseData>[] = [
    {
        key: "name",
        label: "NAME",
        width: "20%",
        align: "center",
        renderCell: (value) => <>{value}</>
    },
    {
        key: "totalWareHouseBins",
        label: "BINS",
        width: "5%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "totalCapacitySpace",
        label: "CAPACITY",
        width: "5%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "totalAvailableSpace",
        label: "AVAILABLE",
        width: "5%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "totalOccupiedSpace",
        label: "OCCUPIED",
        width: "5%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "noOfProducts",
        label: "PRODUCTS",
        width: "5%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "operationalStatus",
        label: "Status",
        width: "10%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "operatorName",
        label: "OPERATOR",
        width: "12%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "contact",
        label: "CONTACT",
        width: "12%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    {
        key: "owershipType",
        label: "TYPE",
        width: "9%",
        align: "center",
        renderCell: (value) => <>{value}</>,
    },
    { key: "actions", label: "ACTIONS", width: "12%", align: "center" },
];

const PER_PAGE = 5;

const WarehousesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<WarehouseData[]>([]);
    const [rawCategoriesData, setRawCategoriesData] = useState<WarehouseData[]>([]);
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
                const responseData = await new WarehouseService().getAllWarehousesWithDetails();
                let mapped: WarehouseData[] = [];
                if (responseData?.length > 0) {
                    let index = 0;
                    let brandsCount = 0;
                    let productsCount = 0;
                    for (const response of responseData) {
                        mapped.push({
                            id: response.warehouse.id,
                            name: response.warehouse.name,
                            totalWareHouseBins: response.warehouseBins?.length ?? 0,
                            totalCapacitySpace: response.totalCapacitySpace,
                            totalAvailableSpace: response.totalAvailableSpace,
                            totalOccupiedSpace: response.totalOccupiedSpace,
                            noOfProducts: response.noOfProducts,
                            operationalStatus: response.warehouse.status,
                            operatorName: 'response',
                            contact: '8903123231',
                            owershipType: response.warehouse.type,
                            disableEdit: true,
                            disableDelete: true,
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
                    el.name?.toLowerCase().includes(query) ||
                    el.operatorName?.toLowerCase().includes(query) || 
                    el.contact?.toLowerCase().includes(query) 
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
        onEdit: (id) => navigate(`/dashboard/warehouses/edit/${id}`),
        // onDelete: (id) => console.log(`Delete warehouse ${id}`),
    };

    return (
        <>
            {isLoading ? (
                <Loader2 />
            ) : (
                <div className="warehouses-list-admin-page-container">
                    <div className="warehouses-list-admin-page-header">
                        <h1 className="warehouses-list-admin-page-title">Warehouse Management</h1>
                        <p className="warehouses-list-admin-page-subtitle">
                            View, Search, And Manage Your Warehouses.
                        </p>
                    </div>

                    <div className="warehouses-list-statistic-card">
                        <StatisticCard
                            title="Total Warehouses"
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

                    <div className="warehouses-list-table-actions-header">
                        <div className="warehouses-list-search-bar-wrapper">
                            <DashBoardInput
                                placeholder="Search Warehouses..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e)}
                                icon={<FiSearch />}
                                showBorder={true}
                            />
                        </div>
                        <div className="warehouses-list-action-btn-wrapper">
                            <DashBoardButton
                                icon={<FiPlus size={25} />}
                                name="Add Warehouse"
                                variant="primary"
                                onClick={() => navigate("/dashboard/warehouses/add")}
                            />
                        </div>
                    </div>

                    <Table<WarehouseData>
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

export default WarehousesList;