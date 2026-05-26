
import { useState, useEffect } from "react";
import { FiBox, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { TbBrandBitbucket } from "react-icons/tb";
import "./BrandsList.css";
import IMAGE from "../../../../../data/DRY_FRUITS.png";
import Table, { ActionCallbacks, IconText, PaginationData, TableColumn } from "../../../../assets/table/Table";
import Loader2 from "../../../../assets/loader/Loader2";
import StatisticCard from "../../../../assets/ui/StatisticCard/StatisticCard";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import { BrandService } from "../../../../service/brand";

interface BrandData {
    id: string;
    slNo: string;
    name: { name: string; image: any };
    category: { name: string; image: any };
    productsCount: number;
    disableEdit?: boolean;
    disableDelete?: boolean;
}

const brandsColumns: TableColumn<BrandData>[] = [
    { key: "slNo", label: "SL. NO", width: "6.5%", align: "center" },
    {
        key: "name",
        label: "NAME",
        width: "23.5%",
        align: "center",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "category",
        label: "CATEGORY",
        width: "23.5%",
        align: "center",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "productsCount",
        label: "PRODUCTS COUNT",
        width: "23.5%",
        align: "center",
        renderCell: (value) => <>{value} items</>,
    },
    { key: "actions", label: "ACTIONS", width: "23.5%", align: "center" },
];

const PER_PAGE = 5;

const BrandsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<BrandData[]>([]);
    const [rawBrandsData, setRawBrandsData] = useState<BrandData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [brandsCount, setBrandsCount] = useState<number>(0);
    const [productsCount, setProductsCount] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const responseData = await new BrandService().getBrandsWithProducts();
                let mapped: BrandData[] = [];
                if (responseData?.length > 0) {
                    let index = 0;
                    let productsCount = 0;
                    for (const response of responseData) {
                        productsCount = productsCount + (response.products?.length ?? 0);
                        mapped.push({
                            id: response.brand.id,
                            slNo: `${index + 1}`,
                            name: { name: response.brand.name, image: IMAGE },
                            category: { name: response.brand.category.name, image: IMAGE },
                            productsCount: response.products?.length ?? 0
                        });
                        index++;
                    }
                    setBrandsCount(index);
                    setProductsCount(productsCount);
                }
                setRawBrandsData(mapped);
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
            const result = rawBrandsData.filter(
                (el) =>
                    el.slNo?.toLowerCase().includes(query) ||
                    el.name?.name?.toLowerCase().includes(query) ||
                    el.category?.name?.toLowerCase().includes(query)
            );
            setFilteredData(result);
        } else {
            setFilteredData(rawBrandsData);
        }
        setCurrentPage(1);
    }, [searchQuery, rawBrandsData]);

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

    const brandsActions: ActionCallbacks = {
        onEdit: (id) => navigate(`/dashboard/brands/edit/${id}`),
        // onDelete: (id) => console.log(`Delete brand ${id}`),
    };

    return (
        <>
            {isLoading ? (
                <Loader2 />
            ) : (
                <div className="brands-list-admin-page-container">
                    <div className="brands-list-admin-page-header">
                        <h1 className="brands-list-admin-page-title">Brands Management</h1>
                        <p className="brands-list-admin-page-subtitle">
                            View, Search, And Manage Your Brands.
                        </p>
                    </div>

                    <div className="brands-list-statistic-card">
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

                    <div className="brands-list-table-actions-header">
                        <div className="brands-list-search-bar-wrapper">
                            <DashBoardInput
                                placeholder="Search brands..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e)}
                                icon={<FiSearch />}
                                showBorder={true}
                            />
                        </div>
                        <div className="brands-list-action-btn-wrapper">
                            <DashBoardButton
                                icon={<FiPlus size={25} />}
                                name="Add Brand"
                                variant="primary"
                                onClick={() => navigate("/dashboard/brands/add")}
                            />
                        </div>
                    </div>

                    <Table<BrandData>
                        width="100%"
                        columns={brandsColumns}
                        data={pagedData}
                        actions={brandsActions}
                        pagination={pagination}
                        idField="id"
                        isSearch={searchQuery}
                    />
                </div>
            )}
        </>
    );
};

export default BrandsList;
