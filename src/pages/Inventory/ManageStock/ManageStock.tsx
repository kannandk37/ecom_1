import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClipboard } from "react-icons/fi";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput, { DashboardInput } from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./ManageStock.css";
import { WarehouseService } from "../../../service/warehouse";
import { Warehouse } from "../../../entity/warehouse";
import { ProductService } from "../../../service/product";
import { Product } from "../../../entity/product";
import { Variant } from "../../../entity/variant";
import { VariantService } from "../../../service/variant";
import { WarehouseBinService } from "../../../service/warehouse_bin";
import { WarehouseBin } from "../../../entity/warehouse_bin";
import { DateTime } from "luxon";
import { Inventory } from "../../../entity/inventory";
import { StockLedger } from "../../../entity/stock_ledger";
import { BinStock } from "../../../entity/bin_stock";
import { InventoryService } from "../../../service/inventory";
import { BinStockService } from "../../../service/bin_stock";
import Toast from "../../../assets/toast/Toast";
import axios from "axios";
import Loader2 from "../../../assets/loader/Loader2";
import { PiBatteryWarningVerticalFill } from "react-icons/pi";
import StockInfoCard from "../StockCard/StockInfoCard";
import SimpleModal from "../../../assets/simple_modal/SimpleModal";

export enum InventoryAction {
  ADJUST = "adjust stock",
  WASTE = "manage waste",
}

enum AdjustmentType {
  ADD = "add",
  REDUCE = "reduce",
}

const ManageStock: React.FC = () => {
  const navigate = useNavigate();

  // Form States
  const [actionType, setActionType] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: InventoryAction.ADJUST, value: InventoryAction.ADJUST });

  // Current Status States
  const [warehouseId, setWarehouseId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Warehouse", value: "" });
  const [binId, setBinId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Warehouse Bin", value: "" });
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

  // Details States
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>(
    AdjustmentType.ADD,
  );
  const [quantity, setQuantity] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<DateTime>();
  const [reason, setReason] = useState<string>('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock Data (Would typically come from API)
  const [currentStockMock, setCurrentStockMock] = useState<number>(0);

  const actionOptions = [
    { id: '', label: InventoryAction.ADJUST, value: InventoryAction.ADJUST },
    { id: '', label: InventoryAction.WASTE, value: InventoryAction.WASTE },
  ];

  const [warehouses, setWarehouses] = useState<{
    id: string;
    label: string;
    value: string;
  }[]>([]);

  const [products, setProducts] = useState<{
    id: string;
    label: string;
    value: string;
  }[]>([]);

  const [warehouseBins, setWarehouseBins] = useState<{
    id: string;
    label: string;
    value: string;
  }[]>([]);

  const [variants, setVariants] = useState<{
    id: string;
    label: string;
    value: string;
  }[]>([]);

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState<boolean>(true);
  const [isBinLoading, setIsBinLoading] = useState<boolean>(false);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [isVariantLoading, setIsVariantLoading] = useState<boolean>(false);
  const [inventory, setInventory] = useState<Inventory>(null);
  const [binStocks, setBinStocks] = useState<BinStock[]>([]);
  const [binStockId, setBinStockId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Batch", value: "" });
  const [binStocksOptions, setBinStocksOptions] = useState<{
    id: string;
    label: string;
    value: string;
  }[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const totalBinStock = useMemo(
    () => binStocks?.reduce((sum: number, a: BinStock) => a?.qtyOnHand + sum, 0),
    [binStocks]
  );

  useEffect(() => {
    if (actionType.value === InventoryAction.WASTE) {
      setAdjustmentType(AdjustmentType.REDUCE);
    }
  }, [actionType]);

  useEffect(() => {
    (async () => {
      setIsWarehouseLoading(true);
      try {
        let warehousesData = await new WarehouseService().getAllWarehouses();
        let warehousesOptions = warehousesData.map((warehouse: Warehouse) => { return { id: warehouse.id, label: warehouse.name, value: warehouse.name } })
        setWarehouses(warehousesOptions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsWarehouseLoading(false);
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (warehouseId?.id) {
        setIsProductLoading(true);
        try {
          let productsData = await new ProductService().getByWarehouseId(warehouseId?.id);
          setProductsData(productsData);
          let productsOptions = productsData.map((product: Product) => { return { id: product.id, label: product.name, value: product.name } })
          setProducts(productsOptions);
        } catch (error) {
          console.log(error);
        } finally {
          setIsProductLoading(false);
        }
      } else {
        setProductsData([]);
        setProducts([]);
        setProductId({ id: null, label: "Select Product", value: "" })
      }
    })()
  }, [warehouseId]);

  useEffect(() => {
    if (!productId?.id) {
      setVariants([]);
      setVariantId({ id: null, label: "Select Variant", value: "" });
      return;
    }
    setIsVariantLoading(true);

    const selectedProduct = productsData.find((product: Product) => product.id === productId.id);

    const options = selectedProduct?.variants?.map((variant: Variant) => ({
      id: variant.id,
      label: variant.name,
      value: variant.name,
    })) || [];

    setVariants(options);
    setIsVariantLoading(false);

  }, [productId?.id, productsData]);

  useEffect(() => {
    (async () => {
      if (warehouseId?.id) {
        setIsBinLoading(true);
        try {
          let warehouseBinsData = await new WarehouseBinService().getWarehouseBinsByWareHouseId(warehouseId.id);
          let warehouseBinOptions = warehouseBinsData.map((warehouseBin: WarehouseBin) => { return { id: warehouseBin.id, label: warehouseBin.binCode, value: warehouseBin.binCode } })
          setWarehouseBins(warehouseBinOptions);
        } catch (error) {
          console.log(error);
        } finally {
          setIsBinLoading(false);
        }
      } else {
        setWarehouseBins([]);
        setBinId({ id: null, label: "Select Warehouse Bin", value: "" });
      }
    })()
  }, [warehouseId]);

  useEffect(() => {
    (async () => {
      if (warehouseId?.id && productId?.id) {
        try {
          let inventoryData = await new InventoryService().inventoryByWarehouseAndProduct(warehouseId.id, productId.id);
          setInventory(inventoryData);
        } catch (error: any) {
          console.log(error)
        } finally {

        }
      } else {
        setInventory(null);
      }
    })()
  }, [warehouseId, productId]);

  useEffect(() => {
    (async () => {
      if (binId?.id && productId?.id) {
        setIsBatchLoading(true);
        try {
          let binStockData = await new BinStockService().binStocksByWarehouseBinAndProduct(binId.id, productId.id);
          setBinStocks(binStockData);
          let options = binStockData.map((binStock: BinStock) => { return { id: binStock.id, label: binStock.batchNumber, value: binStock.batchNumber } })
          setBinStocksOptions(options);
          if (binStockData.length === 1) {
            setBinStockId({
              id: binStockData[0].id,
              label: binStockData[0].batchNumber,
              value: binStockData[0].batchNumber
            });
          } else {
            setBinStockId({ id: null, label: "Select Batch", value: "" });
          }
        } catch (error: any) {
          console.log(error)
        } finally {
          setIsBatchLoading(false);
        }
      } else {
        setBinStocks([]);
        setBinStocksOptions([]);
        setBinStockId({ id: null, label: "Select Batch", value: "" })
      }
    })()
  }, [binId, productId]);

  const submitAdjustment = async (deleteRecord: boolean) => {
    setIsLoading(true);
    try {
      let inventoryData = new Inventory();
      inventoryData.id = inventory?.id;

      let binStockData = new BinStock();
      binStockData.id = binStockId.id;

      let warehouseBin = new WarehouseBin();
      warehouseBin.id = binId.id;
      binStockData.bin = warehouseBin;

      let product = new Product();
      product.id = productId.id;
      binStockData.product = product;

      if (variantId?.id) {
        let variant = new Variant();
        variant.id = variantId.id;
        binStockData.variant = variant;
      }

      let stockLedger = new StockLedger();
      stockLedger.notes = reason;

      if (actionType.value === InventoryAction.WASTE) {
        binStockData.qtyOnHand = Number(quantity);
        await new InventoryService().wasteStock(inventory, binStockData, stockLedger);
      }

      if (actionType.value === InventoryAction.ADJUST) {
        if (adjustmentType === AdjustmentType.ADD) {
          binStockData.qtyOnHand = Number(quantity);
          binStockData.expiryDate = expiryDate;
        } else {
          binStockData.qtyOnHand = -Number(quantity);
        }
        await new InventoryService().adjustStock(inventory, binStockData, stockLedger, deleteRecord);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response?.data?.isCommunicable) {
        setToast(error.response?.data?.error);
      }
    } finally {
      // setCanDelete(false);
      // setQuantity(`0`);
      // setReason('');
      // setWarehouseId({ id: null, label: "Select Warehouse", value: "" });
      // setBinId({ id: null, label: "Select Warehouse Bin", value: "" });
      // setProductId({ id: null, label: "Select Product", value: "" });
      // setVariantId({ id: null, label: "Select Variant", value: "" });
      // setExpiryDate('');
    }
  };

  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!warehouseId.id) newErrors.warehouseId = "Required";
    if (!binId.id) newErrors.binId = "Required";
    if (!productId.id) newErrors.productId = "Required";
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0)
      newErrors.quantity = "Valid quantity required";
    if (!reason.trim()) newErrors.reason = "Reason is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if reduce will empty the bin stock — show modal first, don't submit yet
    if (
      actionType.value === InventoryAction.ADJUST &&
      adjustmentType === AdjustmentType.REDUCE
    ) {
      const binStockChecker = binStocks.find((el) => el.id === binStockId?.id);
      if (binStockChecker && binStockChecker.qtyOnHand - Number(quantity) <= 0) {
        setOpenModal(true);
        return; // ← stop here, wait for user to confirm or cancel
      }
    }

    await submitAdjustment(false);
  };
  const selectedBinStock = binStocks.find((el: BinStock) => el.id === binStockId?.id);
  return (
    <>
      {
        isLoading ? (
          <Loader2 />
        ) : (
          <>
            {
              toast && (
                <Toast
                  title={'Manage Stock'}
                  description={toast}
                  isError={true}
                  duration={5000}
                  onClose={() => setToast(null)}
                />
              )
            }
            <div className="create-Inventory-stock-container">
              {/* Header Area */}
              <div className="create-Inventory-stock-header">
                <button
                  className="create-Inventory-stock-back-btn"
                  onClick={() => navigate("/dashboard/add-product-to-inventory")}
                >
                  <FiArrowLeft /> Back to Inventory
                </button>
                <div className="create-Inventory-stock-title">
                  <h1 className="create-Inventory-stock-title">
                    {(actionType.value as any) === InventoryAction.ADJUST
                      ? "Adjust Stock"
                      : "Manage Waste"}
                  </h1>
                  <div className="create-Inventory-stock-action-selector">
                    <label>Inventory Action </label>
                    <div className="create-Inventory-stock-action-dropdown">
                      <Dropdown
                        options={actionOptions}
                        label={actionType.label || ""}
                        selected={actionType}
                        onSelect={(val) => { setActionType(val as any) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Action Selector */}


              <div className="create-Inventory-stock-content-grid">
                {/* LEFT COLUMN: Current Status */}
                <div className="create-Inventory-stock-card">
                  <h2 className="create-Inventory-stock-card-title">Current Status</h2>

                  <div className="create-Inventory-stock-dropdown-grid">
                    <div className="create-Inventory-stock-field">
                      <label>
                        Warehouse <span className="create-Inventory-stock-req">*</span>
                      </label>
                      <Dropdown
                        isLoading={isWarehouseLoading}
                        options={warehouses}
                        label={warehouseId.label || "Select Warehouse"}
                        noData={warehouses?.length == 0}
                        selected={warehouseId}
                        onSelect={(val: any) => {
                          if (val) {
                            setWarehouseId(val as any)
                          } else {
                            setWarehouseId({ id: null, label: "Select Warehouse", value: "" });
                          }
                        }} />
                      {errors.warehouseId && (
                        <span className="create-Inventory-stock-error">
                          {errors.warehouseId}
                        </span>
                      )}
                    </div>

                    <div className="create-Inventory-stock-field">
                      <label>
                        Bin / Location{" "}
                        <span className="create-Inventory-stock-req">*</span>
                      </label>
                      <Dropdown
                        isLoading={isBinLoading}
                        options={warehouseBins}
                        label={binId.label || "Select Warehouse Bin"}
                        noData={warehouseBins?.length == 0}
                        selected={binId}
                        onSelect={(val: any) => {
                          if (val) {
                            setBinId(val as any)
                          } else {
                            setBinId({ id: null, label: "Select Warehouse Bin", value: "" });
                          }
                        }} />
                      {errors.binId && (
                        <span className="create-Inventory-stock-error">
                          {errors.binId}
                        </span>
                      )}
                    </div>

                    <div className="create-Inventory-stock-field">
                      <label>
                        Product <span className="create-Inventory-stock-req">*</span>
                      </label>
                      <Dropdown
                        isLoading={isProductLoading}
                        options={products}
                        label={productId.label || "Select Product"}
                        noData={products?.length == 0}
                        selected={productId}
                        onSelect={(val: any) => {
                          if (val) {
                            setProductId(val as any)
                          } else {
                            setProductId({ id: null, label: "Select Product", value: "" });
                          }
                        }}
                      />
                      {errors.productId && (
                        <span className="create-Inventory-stock-error">
                          {errors.productId}
                        </span>
                      )}
                    </div>

                    <div className="create-Inventory-stock-field">
                      <label>
                        Variant / SKU{" "}
                        <span className="create-Inventory-stock-req">*</span>
                      </label>
                      <Dropdown
                        isLoading={isVariantLoading}
                        options={variants}
                        label={variantId.label || "Select Variant"}
                        noData={variants?.length == 0}
                        selected={variantId}
                        onSelect={(val: any) => {
                          if (val) {
                            setVariantId(val as any)
                          } else {
                            setVariantId({ id: null, label: "Select Variant", value: "" });
                          }
                        }} />
                      {errors.variantId && (
                        <span className="create-Inventory-stock-error">
                          {errors.variantId}
                        </span>
                      )}
                    </div>

                    <StockInfoCard
                      // label={`Current Stock in ${binStocks?.length > 0 && binStocks[0]?.bin?.binCode ? binStocks[0].bin.binCode : 'Selected Bin'}`}
                      label={
                        <>
                          Current Stock in <b style={{ color: '#1a1a1a', fontSize: '0.85rem' }}>{binStocks?.length > 0 && binStocks[0]?.bin?.binCode ? binStocks[0].bin.binCode : 'Selected Bin'}</b>
                        </>
                      }
                      value={`Units - ${totalBinStock}`}
                    />

                    {
                      binStockId?.id && selectedBinStock &&
                      <StockInfoCard
                        // label={`Current Stock Selected Batch - ${binStockId?.label}`}
                        label={
                          <>
                            Current Stock Selected Batch - <b style={{ color: '#1a1a1a', fontSize: '0.85rem' }}>{binStockId?.label}</b>
                          </>
                        }
                        value={`Units - ${selectedBinStock?.qtyOnHand ?? 0}\n Expires - ${selectedBinStock?.expiryDate?.toFormat('dd-MM-yyyy') ?? ''}`}
                      />
                    }

                    <StockInfoCard
                      // label={`Total Stock in ${warehouseId.value || 'Select Warehouse'}`}
                      label={
                        <>
                          Total Stock in <b style={{ color: '#1a1a1a', fontSize: '0.85rem' }}>{warehouseId.value || 'Select Warehouse'}</b>
                        </>
                      }
                      value={`Units - ${inventory?.qtyOnHand ?? 0}`}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: Adjustment Details */}
                <div className="create-Inventory-stock-card">
                  <h2 className="create-Inventory-stock-card-title">
                    {actionType.value === InventoryAction.ADJUST
                      ? "Adjustment Details"
                      : "Manage Waste Details"}
                  </h2>

                  <div className="create-Inventory-stock-form-col">
                    <div className="create-Inventory-stock-row-split">
                      <div className="create-Inventory-stock-field">
                        <label>
                          {actionType.value === InventoryAction.ADJUST
                            ? "Adjustment Type"
                            : "Waste Type"}{" "}
                          <span className="create-Inventory-stock-req">*</span>
                        </label>
                        <div className="create-Inventory-stock-radio-group">
                          {actionType.value === InventoryAction.ADJUST && (
                            <label className="create-Inventory-stock-radio-label">
                              <input
                                type="radio"
                                name="adjustmentType"
                                value={AdjustmentType.ADD}
                                checked={adjustmentType === AdjustmentType.ADD}
                                onChange={() => setAdjustmentType(AdjustmentType.ADD)}
                              />
                              Add (+)
                            </label>
                          )}
                          <label className="create-Inventory-stock-radio-label">
                            <input
                              type="radio"
                              name="adjustmentType"
                              value={AdjustmentType.REDUCE}
                              checked={adjustmentType === AdjustmentType.REDUCE}
                              onChange={() => setAdjustmentType(AdjustmentType.REDUCE)}
                            />
                            Reduce (-)
                          </label>
                        </div>
                      </div>

                      <div className="create-Inventory-stock-field">
                        <label>
                          Quantity <span className="create-Inventory-stock-req">*</span>
                        </label>
                        <DashBoardInput
                          placeholder="0"
                          type="text"
                          value={quantity ?? ''}
                          onChange={(e: any) => setQuantity(e)}
                        />
                        {errors.quantity && (
                          <span className="create-Inventory-stock-error">
                            {errors.quantity}
                          </span>
                        )}
                      </div>

                      {
                        actionType.label != InventoryAction.WASTE && adjustmentType == AdjustmentType.ADD &&
                        <div className="create-Inventory-stock-field">
                          <label>
                            Expiry Date <span className="create-Inventory-stock-req">*</span>
                          </label>
                          <DashBoardInput
                            placeholder="dd-mm-yyyy"
                            type="date"
                            value={expiryDate ? expiryDate?.toFormat('yyyy-MM-dd') : ''}
                            onChange={(e: string) => { setExpiryDate(DateTime.fromJSDate(new Date(e))); }}
                          />
                          {errors.expiryDate && (
                            <span className="create-Inventory-stock-error">
                              {errors.expiryDate}
                            </span>
                          )}
                        </div>
                      }

                      <div className="create-Inventory-stock-field">
                        <label>
                          Batch <span className="create-Inventory-stock-req">*</span>
                        </label>
                        <Dropdown
                          isLoading={isBatchLoading}
                          options={binStocksOptions}
                          label={binStockId.label || "Select Batch"}
                          noData={binStocks?.length == 0}
                          selected={binStockId}
                          onSelect={(val: any) => {
                            if (val) {
                              setBinStockId(val as any)
                            } else {
                              setBinStockId({ id: null, label: "Select Batch", value: "" });
                            }
                          }}
                          width="240px"
                        />
                        {errors.binStockId && (
                          <span className="create-Inventory-stock-error">
                            {errors.binStockId}
                          </span>
                        )}
                      </div>

                    </div>

                    <div className="create-Inventory-stock-field create-Inventory-stock-flex-grow">
                      <label>
                        Reason / Notes{" "}
                        <span className="create-Inventory-stock-req">*</span>
                      </label>
                      <DashboardInput
                        type="textarea"
                        placeholder={`Reason for ${actionType.label == InventoryAction.ADJUST ? 'Adjustment' : 'Wastage'}`}
                        value={reason ?? ''}
                        row={3}
                        onChange={(e) => setReason(e)}
                      />
                      {errors.reason && (
                        <span className="create-Inventory-stock-error">
                          {errors.reason}
                        </span>
                      )}
                    </div>

                    <div className="create-Inventory-stock-footer-actions">
                      <DashBoardButton
                        name="Cancel"
                        variant="secondary"
                        onClick={() => navigate("/dashboard/inventory")}
                      />
                      <DashBoardButton
                        name="Submit Adjustment"
                        variant="primary"
                        onClick={handleSubmit}
                        // onClick={async () => { await new InventoryService().createInventory() }}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {openModal &&
              <SimpleModal
                title={'Bin Stock Getting Emptied ! Can We Delete The Bin Stock Record ?'}
                subtitle={'Bin Stock quantity is becoming zero (0), so can we free up binstock by deleting ?'}
                icon={<PiBatteryWarningVerticalFill />}
                isWarning={true}
                button1Name={"NO"}
                button1OnClick={async () => {
                  setOpenModal(false);
                  await submitAdjustment(false);
                }}
                button2Name={"Yes"}
                button2OnClick={async () => {
                  setOpenModal(false);
                  await submitAdjustment(true);
                }}
                onOverlayClick={() => setOpenModal(false)}
              />
            }
          </>
        )
      }
    </>
  );
};

export default ManageStock;
