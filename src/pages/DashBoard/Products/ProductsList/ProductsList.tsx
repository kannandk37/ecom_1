
import { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ProductsList.css";
import IMAGE from "../../../../../data/DRY_FRUITS.png";
import Table, { ActionCallbacks, IconText, PaginationData, TableColumn } from "../../../../assets/table/Table";
import Loader2 from "../../../../assets/loader/Loader2";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import { ProductService } from "../../../../service/product";

interface ProductData {
    id: string;
    slNo: string;
    name: { name: string; image: any };
    brand: { name: string; image: any };
    category: { name: string; image: any };
    variantsCount: number;
}

const productsColumns: TableColumn<ProductData>[] = [
    { key: "slNo", label: "SL. NO", width: "6.4%", align: "center" },
    {
        key: "name",
        label: "NAME",
        width: "21.2%",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
        {
        key: "brand",
        label: "Brand",
        width: "21.2%",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "category",
        label: "CATEGORY",
        width: "21.2%",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "variantsCount",
        label: "VariantS COUNT",
        width: "15%",
        align: "center",
        renderCell: (value) => <>{value} items</>,
    },
    { key: "actions", label: "ACTIONS", width: "15%", align: "center" },
];

const PER_PAGE = 5;

const ProductsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<ProductData[]>([]);
    const [rawProductsData, setRawProductsData] = useState<ProductData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [variantsCount, setVariantsCount] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const responseData = await new ProductService().get();
                let mapped: ProductData[] = [];
                if (responseData?.length > 0) {
                    let index = 0;
                    let variantsCount = 0;
                    for (const response of responseData) {
                        variantsCount = variantsCount + (response.variants?.length ?? 0);
                        mapped.push({
                            id: response.id,
                            slNo: `${index + 1}`,
                            name: { name: response.name, image: IMAGE },
                            brand: { name: response.brand.name, image: IMAGE },
                            category: {name: response.category.name, image: IMAGE},
                            variantsCount: response.variants?.length ?? 0
                        });
                        index++;
                    }
                    setVariantsCount(variantsCount);
                }
                setRawProductsData(mapped);
                setFilteredData(mapped);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (query) {
            const result = rawProductsData.filter(
                (el) =>
                    el.slNo?.toLowerCase().includes(query) ||
                    el.name?.name?.toLowerCase().includes(query) ||
                    el.brand?.name?.toLowerCase().includes(query) ||
                    el.category?.name?.toLowerCase().includes(query)
            );
            setFilteredData(result);
        } else {
            setFilteredData(rawProductsData);
        }
        setCurrentPage(1);
    }, [searchQuery, rawProductsData]);

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

    const productsActions: ActionCallbacks = {
        onEdit: (id) => navigate(`/dashboard/products/edit/${id}`),
        // onDelete: (id) => console.log(`Delete product ${id}`),
    };

    return (
        <>
            {isLoading ? (
                <Loader2 />
            ) : (
                <div className="products-list-admin-page-container">
                    <div className="products-list-admin-page-header">
                        <h1 className="products-list-admin-page-title">Products Management</h1>
                        <p className="products-list-admin-page-subtitle">
                            View, Search, And Manage Your Products.
                        </p>
                    </div>

                    <div className="products-list-table-actions-header">
                        <div className="products-list-search-bar-wrapper">
                            <DashBoardInput
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e)}
                                icon={<FiSearch />}
                                showBorder={true}
                            />
                        </div>
                        <div className="products-list-action-btn-wrapper">
                            <DashBoardButton
                                icon={<FiPlus size={25} />}
                                name="Add Product"
                                variant="primary"
                                onClick={() => navigate("/dashboard/products/add")}
                            />
                        </div>
                    </div>

                    <Table<ProductData>
                        width="100%"
                        columns={productsColumns}
                        data={pagedData}
                        actions={productsActions}
                        pagination={pagination}
                        idField="id"
                        isSearch={searchQuery}
                    />
                </div>
            )}
        </>
    );
};

export default ProductsList;
