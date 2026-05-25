
import { useState, useEffect } from "react";
import { FiBox, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./VariantsList.css";
import IMAGE from "../../../../../data/DRY_FRUITS.png";
import Table, { ActionCallbacks, IconText, PaginationData, TableColumn } from "../../../../assets/table/Table";
import Loader2 from "../../../../assets/loader/Loader2";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import { ProductService } from "../../../../service/product";
import Chip from "../../../../assets/ui/Chip/Chip";
import { Product } from "../../../../entity/product";

interface VariantData {
    id: string;
    slNo: string;
    name: { name: string; image: any };
    product: { name: string; image: any },
    brand: { name: string; image: any };
    category: { name: string; image: any };
}

const variantsColumns: TableColumn<VariantData>[] = [
    { key: "slNo", label: "SL. NO", width: "6.4%", align: "center" },
    {
        key: "name",
        label: "NAME",
        width: "21.2%",
        align: "center",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "product",
        label: "Product",
        width: "15%",
        align: "center",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "brand",
        label: "Brand",
        width: "21.2%",
        align: "center",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    {
        key: "category",
        label: "CATEGORY",
        width: "21.2%",
        align: "center",
        renderCell: (value) => <IconText image={value.image} text={value.name} />,
    },
    { key: "actions", label: "ACTIONS", width: "15%", align: "center" },
];

const PER_PAGE = 5;

const VariantsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<VariantData[]>([]);
    const [rawVariantsData, setRawVariantsData] = useState<VariantData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [variantsCount, setVariantsCount] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const responseData = await new ProductService().get();
                let mapped: VariantData[] = [];
                if (responseData?.length > 0) {
                    let index = 0;
                    let variantsCount = 0;
                    let variants = responseData.flatMap((product: Product) => product.variants);
                    if (variants?.length > 0) {
                        for (const variant of variants) {
                            if (variant) {
                                let product = responseData.find((product: Product) => product.id == variant.product?.id);
                                mapped.push({
                                    id: variant.id,
                                    slNo: `${index + 1}`,
                                    name: { name: variant.name, image: IMAGE },
                                    brand: { name: product?.brand?.name, image: IMAGE },
                                    category: { name: product?.category?.name, image: IMAGE },
                                    product: { name: product?.name, image: IMAGE }
                                });
                                index++;
                            }
                        }
                    }
                    setVariantsCount(variantsCount);
                }
                setRawVariantsData(mapped);
                setFilteredData(mapped);
            } catch (err) {
                console.error("Failed to load variants", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (query) {
            const result = rawVariantsData.filter(
                (el) =>
                    el.slNo?.toLowerCase().includes(query) ||
                    el.name?.name?.toLowerCase().includes(query) ||
                    el.product?.name?.toLowerCase().includes(query) ||
                    el.brand?.name?.toLowerCase().includes(query) ||
                    el.category?.name?.toLowerCase().includes(query)
            );
            setFilteredData(result);
        } else {
            setFilteredData(rawVariantsData);
        }
        setCurrentPage(1);
    }, [searchQuery, rawVariantsData]);

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

    const variantsActions: ActionCallbacks = {
        onEdit: (id) => navigate(`/dashboard/variants/edit/${id}`),
        // onDelete: (id) => console.log(`Delete variant ${id}`),
    };

    return (
        <>
            {isLoading ? (
                <Loader2 />
            ) : (
                <div className="variants-list-admin-page-container">
                    <div className="variants-list-admin-page-header">
                        <h1 className="variants-list-admin-page-title">Variants Management</h1>
                        <p className="variants-list-admin-page-subtitle">
                            View, Search, And Manage Your Variantts.
                        </p>
                    </div>

                    <div className="variants-list-table-actions-header">
                        <div className="variants-list-search-bar-wrapper">
                            <DashBoardInput
                                placeholder="Search variants..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e)}
                                icon={<FiSearch />}
                                showBorder={true}
                            />
                        </div>
                        <div className="variants-list-statistic-card">
                            <Chip
                                title="Total Variants"
                                value={rawVariantsData.length ?? 0}
                                icon={<FiBox />}
                                style={{ marginLeft: '380px' }}
                                variant="outline"
                            />
                        </div>
                        <div className="variants-list-action-btn-wrapper">
                            <DashBoardButton
                                icon={<FiPlus size={25} />}
                                name="Add Variant"
                                variant="primary"
                                onClick={() => navigate("/dashboard/variants/add")}
                            />
                        </div>
                    </div>

                    <Table<VariantData>
                        width="100%"
                        columns={variantsColumns}
                        data={pagedData}
                        actions={variantsActions}
                        pagination={pagination}
                        idField="id"
                        isSearch={searchQuery}
                    />
                </div>
            )}
        </>
    );
};

export default VariantsList;
