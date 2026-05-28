import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./InventoriesList.css";
import { useNavigate } from "react-router-dom";
import {
  TbAlertCircleFilled,
  TbAlertTriangleFilled,
} from "react-icons/tb";
import Table, {
  TableColumn,
  PaginationData,
  ActionCallbacks,
} from "../../../../assets/table/Table";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import Loader2 from "../../../../assets/loader/Loader2";
import StatisticCard from "../../../../assets/ui/StatisticCard/StatisticCard";
import { WarehouseService } from "../../../../service/warehouse";
import { FaBoxesPacking } from "react-icons/fa6";
import { IoBook } from "react-icons/io5";
import { LuPackageX } from "react-icons/lu";
import { BsClipboard2CheckFill } from "react-icons/bs";
import Dropdown from "../../../../assets/dropdown/DropDown";
import { Warehouse } from "../../../../entity/warehouse";
import { Product } from "../../../../entity/product";
import { ProductService } from "../../../../service/product";
import { Variant } from "../../../../entity/variant";
import { InventoryService } from "../../../../service/inventory";
import { Inventory } from "../../../../entity/inventory";

interface WarehouseData {
  id: string;
  warehouse: { id: string, name: string };
  product: { id: string, name: string };
  variant: { id: string, name: string };
  available: number;
  reserved: number;
  damaged: number;
  sold: number;
  committed: number;
  disableEdit?: boolean;
  disableDelete?: boolean;
}

const categoriesColumns: TableColumn<WarehouseData>[] = [
  {
    key: "warehouse",
    label: "WAREHOUSE",
    width: "20%",
    align: "center",
    renderCell: (value) => <>{value.name}</>,
  },
  {
    key: "product",
    label: "PRODUCT",
    width: "16%",
    align: "center",
    renderCell: (value) => <>{value.name}</>,
  },
  {
    key: "variant",
    label: "VARIANT",
    width: "16%",
    align: "center",
    renderCell: (value) => <>{value?.name ?? '-'}</>,
  },
  {
    key: "available",
    label: "AVAILABLE",
    width: "7%",
    align: "center",
    renderCell: (value) => <>{value}</>,
  },
  {
    key: "reserved",
    label: "RESERVED",
    width: "7%",
    align: "center",
    renderCell: (value) => <>{value}</>,
  },
  {
    key: "damaged",
    label: "DAMAGED",
    width: "7%",
    align: "center",
    renderCell: (value) => <>{value}</>,
  },
  {
    key: "sold",
    label: "SOLD",
    width: "7%",
    align: "center",
    renderCell: (value) => <>{value}</>,
  },
  {
    key: "committed",
    label: "COMMITTED",
    width: "7%",
    align: "center",
    renderCell: (value) => <>{value}</>,
  },
  { key: "actions", label: "ACTIONS", width: "13%", align: "center" },
];

const PER_PAGE = 5;

export function inventoriesToTableData(inventories: Inventory[]): WarehouseData[] {
  return [...inventories]
    .sort((a, b) => {
      
      const warehouseComp = a.warehouse.name.localeCompare(b.warehouse.name);
      if (warehouseComp !== 0) return warehouseComp;

      const productComp = a.product.name.localeCompare(b.product.name);
      if (productComp !== 0) return productComp;

      const aVariant = a.variant?.name ?? 'No Variant';
      const bVariant = b.variant?.name ?? 'No Variant';
      return aVariant.localeCompare(bVariant);
    })
    .map((inventory) => ({
      id: inventory.id,
      warehouse: { id: inventory.warehouse.id, name: inventory.warehouse.name },
      product: { id: inventory.product.name, name: inventory.product.name },
      variant: inventory.variant?.id ? { id: inventory.variant?.name, name: inventory.variant?.name } : null,
      available: inventory.qtyOnHand,
      reserved: inventory.qtyReserved,
      damaged: inventory.totalDamaged,
      sold: inventory.totalSold,
      committed: inventory.qtyCommitted,
      disableEdit: false,
      disableDelete: false,
    }));
};

const InventoriesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<WarehouseData[]>([]);
  const [rawInventoriesData, setRawInventoriesData] = useState<WarehouseData[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lowStock, setLowStock] = useState<number>(0);
  const [outOfStock, setOutOfStock] = useState<number>(0);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [damagedStock, setDamagedStock] = useState<number>(0);
  const [warehouseId, setWarehouseId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Warehouse", value: "" });
  const [productId, setProductId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Product", value: "" });
  const [variantId, setVariantId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Variant", value: "" });
  const [warehouses, setWarehouses] = useState<
    {
      id: string;
      label: string;
      value: string;
    }[]
  >([]);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState<boolean>(true);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [isVariantLoading, setIsVariantLoading] = useState<boolean>(false);

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [products, setProducts] = useState<
    {
      id: string;
      label: string;
      value: string;
    }[]
  >([]);
  const [variants, setVariants] = useState<
    {
      id: string;
      label: string;
      value: string;
    }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsWarehouseLoading(true);
      try {
        let warehousesData = await new WarehouseService().getAllWarehouses();
        let warehousesOptions = warehousesData.map((warehouse: Warehouse) => {
          return {
            id: warehouse.id,
            label: warehouse.name,
            value: warehouse.name,
          };
        });
        setWarehouses(warehousesOptions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsWarehouseLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (warehouseId?.id) {
        setIsProductLoading(true);
        try {
          let productsData = await new ProductService().getByWarehouseId(
            warehouseId?.id,
          );
          setProductsData(productsData);
          let productsOptions = productsData.map((product: Product) => {
            return { id: product.id, label: product.name, value: product.name };
          });
          setProducts(productsOptions);
        } catch (error) {
          console.log(error);
        } finally {
          setIsProductLoading(false);
        }
      } else {
        setProductsData([]);
        setProducts([]);
        setProductId({ id: null, label: "Select Product", value: "" });
      }
    })();
  }, [warehouseId]);

  useEffect(() => {
    if (!productId?.id) {
      setVariants([]);
      setVariantId({ id: null, label: "Select Variant", value: "" });
      return;
    }
    setIsVariantLoading(true);

    const selectedProduct = productsData.find(
      (product: Product) => product.id === productId.id,
    );

    const options =
      selectedProduct?.variants?.map((variant: Variant) => ({
        id: variant.id,
        label: variant.name,
        value: variant.name,
      })) || [];

    setVariants(options);
    setIsVariantLoading(false);
  }, [productId?.id, productsData]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const responseData =
          await new InventoryService().inventories();
        let mapped: WarehouseData[] = [];
        if (responseData?.length > 0) {
          mapped = await inventoriesToTableData(responseData);
          let totalStockData = 0;
          let damagedStockData = 0;
          let soldOutStockData = 0;
          let lowStockData = 0;
          if (mapped?.length > 0) {
            for (const datum of mapped) {
              totalStockData = totalStockData + datum.available;
              damagedStockData = damagedStockData + datum.damaged;
              if (datum.available == 0) {
                soldOutStockData++;
              } else if (datum.available <= datum.reserved) {
                lowStockData++;
              };
            };
          };
          setTotalStock(totalStockData);
          setLowStock(lowStockData);
          setOutOfStock(soldOutStockData);
          setDamagedStock(damagedStockData);
        };
        setRawInventoriesData(mapped);
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
      const result = rawInventoriesData.filter(
        (el) =>
          el.warehouse?.name?.toLowerCase().includes(query) ||
          el.product?.name?.toLowerCase().includes(query) ||
          el.variant?.name?.toLowerCase().includes(query),
      );
      setFilteredData(result);
    } else {
      setFilteredData(rawInventoriesData);
    }
    setCurrentPage(1);
  }, [searchQuery, rawInventoriesData]);

  useEffect(() => {
    if ((warehouseId?.id || productId?.id || variantId?.id) && rawInventoriesData?.length) {
      const filtered = rawInventoriesData.filter((el) => {
        const matchWarehouse = warehouseId?.id ? el.warehouse.name === warehouseId.label : true;
        const matchProduct = productId?.id ? el.product.name === productId.label : true;
        const matchVariant = variantId?.id ? el.variant.name === variantId.label : true;
        return matchWarehouse && matchProduct && matchVariant;
      });
      console.log(filtered, 'filtered');
      setFilteredData(filtered);
    } else {
      setFilteredData(rawInventoriesData);
    }
    setCurrentPage(1);
  }, [warehouseId, productId, variantId]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / PER_PAGE);

  const pagedData = filteredData.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
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
    onEdit: (id) => navigate(`/dashboard/inventory/edit-product/${id}`),
    // onDelete: (id) => console.log(`Delete inventory ${id}`),
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="inventories-list-admin-page-container">
          <div className="inventories-list-admin-page-header">
            <h1 className="inventories-list-admin-page-title">
              Inventory Management
            </h1>
            <p className="inventories-list-admin-page-subtitle">
              View, Search, And Manage Your Inventories.
            </p>
          </div>

          <div className="inventories-list-statistic-card">
            <StatisticCard
              title="Total Items"
              value={totalStock}
              icon={<BsClipboard2CheckFill />}
              iconColor="#000000"
              showBackground={true}
            />
            <StatisticCard
              title="Low Stock Products"
              value={lowStock}
              icon={<TbAlertTriangleFilled />}
              iconBgColor="#fff024c5"
              iconColor="#000000"
              showBackground={true}
            />
            <StatisticCard
              title="Out Of Stock Products"
              value={outOfStock}
              icon={<TbAlertCircleFilled />}
              iconBgColor="#ff0000a9"
              iconColor="#000000"
              showBackground={true}
            />
            <StatisticCard
              title="Damaged Products"
              value={damagedStock}
              icon={<LuPackageX />}
              iconBgColor="#ffba26d5"
              iconColor="#000000"
              showBackground={true}
            />
          </div>

          <div className="inventories-list-table-actions-header">
            <div className="inventories-list-search-bar-wrapper">
              <DashBoardInput
                placeholder="Search Inventories..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e)}
                icon={<FiSearch />}
                showBorder={true}
              />
              <div className="inventories-list-dropdown-wrapper">
                <Dropdown
                  isLoading={isWarehouseLoading}
                  options={warehouses}
                  label={warehouseId.label || "Select Warehouse"}
                  noData={warehouses?.length == 0}
                  selected={warehouseId}
                  onSelect={(val: any) => {
                    if (val) {
                      setWarehouseId(val as any);
                    } else {
                      setWarehouseId({
                        id: null,
                        label: "Select Warehouse",
                        value: "",
                      });
                    }
                  }}
                />
                <Dropdown
                  isLoading={isProductLoading}
                  options={products}
                  label={productId.label || "Select Product"}
                  noData={products?.length == 0}
                  selected={productId}
                  onSelect={(val: any) => {
                    if (val) {
                      setProductId(val as any);
                    } else {
                      setProductId({
                        id: null,
                        label: "Select Product",
                        value: "",
                      });
                    }
                  }}
                />
                <Dropdown
                  isLoading={isVariantLoading}
                  options={variants}
                  label={variantId.label || "Select Variant"}
                  noData={variants?.length == 0}
                  selected={variantId}
                  onSelect={(val: any) => {
                    if (val) {
                      setVariantId(val as any);
                    } else {
                      setVariantId({
                        id: null,
                        label: "Select Variant",
                        value: "",
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div className="inventories-list-action-btn-wrapper">
              <DashBoardButton
                icon={<IoBook size={25} />}
                name="Manage Stock"
                variant="primary"
                onClick={() => navigate("/dashboard/manage-stock")}
              />
              <DashBoardButton
                icon={<FaBoxesPacking size={25} />}
                name="Add Product To Inventory"
                variant="primary"
                onClick={() => navigate("/dashboard/inventory/add-product")}
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

export default InventoriesList;
