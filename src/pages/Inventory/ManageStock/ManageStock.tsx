import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClipboard } from "react-icons/fi";

import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
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

export enum InventoryAction {
  ADJUST = "adjust stock",
  WASTE = "manage waste",
}

export enum AdjustmentType {
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
  }>({ id: null, label: "Adjust Stock", value: InventoryAction.ADJUST });

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
  }>({ id: null, label: "Select Warehouse", value: "" });
  const [productId, setProductId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Warehouse", value: "" });
  const [variantId, setVariantId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: null, label: "Select Warehouse", value: "" });

  // Details States
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>(
    AdjustmentType.ADD,
  );
  const [quantity, setQuantity] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<DateTime>();
  const [reason, setReason] = useState<string>(null);

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

  const [isWarehouseLoading, setIsWarehouseLoading] = useState<boolean>(true);
  const [isBinLoading, setIsBinLoading] = useState<boolean>(false);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [isVariantLoading, setIsVariantLoading] = useState<boolean>(false);

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
      setIsProductLoading(true);
      try {
        let productsData = await new ProductService().get();
        let productsOptions = productsData.map((product: Product) => { return { id: product.id, label: product.name, value: product.name } })
        setProducts(productsOptions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsProductLoading(false);
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (productId.id) {
        setIsVariantLoading(true);
        try {
          let variantsData = await new VariantService().getByProductId(productId.id);
          let variantsOptions = variantsData.map((variant: Variant) => { return { id: variant.id, label: variant.name, value: variant.name } })
          setVariants(variantsOptions);
        } catch (error) {
          console.log(error);
        } finally {
          setIsVariantLoading(false);
        }
      }
    })()
  }, [productId]);

  useEffect(() => {
    (async () => {
      if (warehouseId.id) {
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
      }
    })()
  }, [warehouseId]);

  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!warehouseId) newErrors.warehouseId = "Required";
    if (!binId) newErrors.binId = "Required";
    if (!productId) newErrors.productId = "Required";
    if (!variantId) newErrors.variantId = "Required";
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0)
      newErrors.quantity = "Valid quantity required";
    if (!reason.trim()) newErrors.reason = "Reason is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        action: actionType,
        warehouseId,
        binId,
        productId,
        variantId,
        adjustmentType,
        quantity: Number(quantity),
        reason,
      };

      let warehouseInfo = new Warehouse();
      warehouseInfo.id = warehouseId.id;

      let binInfo = new WarehouseBin();
      binInfo.id = binId.id;

      let productInfo = new Product();
      productInfo.id = productId.id;

      let variantInfo = new Variant();
      variantInfo.id = variantId?.id;


      let inventory = new Inventory();
      inventory.warehouse = warehouseInfo;
      inventory.product = productInfo;
      inventory.variant = variantInfo;
      inventory.qtyOnHand = quantity;
      inventory.maxStockLevel // need data for max stock for this product in this variant in this warehouse
      inventory.reorderPoint  // quantity where reorder is triggered


      let stockLedger = new StockLedger();
      stockLedger.notes = reason;
      stockLedger.quantityDelta = quantity;

      let binStock = new BinStock();
      binStock.product = productInfo;
      binStock.variant = variantInfo;
      binStock.bin = binInfo;
      binStock.expiryDate = expiryDate;
      
      console.log("Submitting Inventory Update:", payload);
      // Simulate API call
      // await axios.post('/api/inventory/adjust', payload);

      navigate("/dashboard/manage-stock");
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, submit: "Failed to update stock." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-Inventory-stock-container">
      {/* Header Area */}
      <div className="create-Inventory-stock-header">
        <button
          className="create-Inventory-stock-back-btn"
          onClick={() => navigate("/dashboard/inventory")}
        >
          <FiArrowLeft /> Back to Inventory
        </button>
        <h1 className="create-Inventory-stock-title">
          {(actionType.value as any) === InventoryAction.ADJUST
            ? "Adjust Stock"
            : "Manage Waste"}
        </h1>
      </div>

      {/* Global Action Selector */}
      <div className="create-Inventory-stock-action-selector">
        <label>Inventory Action</label>
        <div className="create-Inventory-stock-action-dropdown">
          <Dropdown
            options={actionOptions}
            label={actionType.label || ""}
            onSelect={(val) => { console.log(val); setActionType(val as any) }}
          />
        </div>
      </div>

      <div className="create-Inventory-stock-content-grid">
        {/* LEFT COLUMN: Current Status */}
        <div className="create-Inventory-stock-card">
          <h2 className="create-Inventory-stock-card-title">Current Status</h2>

          <div className="create-Inventory-stock-form-col">
            <div className="create-Inventory-stock-field">
              <label>
                Warehouse <span className="create-Inventory-stock-req">*</span>
              </label>
              <Dropdown
                isLoading={isWarehouseLoading}
                options={warehouses}
                label={warehouseId.label || "Select Warehouse"}
                noData={warehouses?.length == 0}
                onSelect={(val: any) => setWarehouseId(val as any)}
              />
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
                label={binId.label || "Select Bin"}
                noData={warehouseBins?.length == 0}
                onSelect={(val: any) => setBinId(val as any)}
              />
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
                onSelect={(val: any) => setProductId(val as any)}
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
                onSelect={(val: any) => setVariantId(val as any)}
              />
              {errors.variantId && (
                <span className="create-Inventory-stock-error">
                  {errors.variantId}
                </span>
              )}
            </div>

            <div className="create-Inventory-stock-info-box">
              <div className="create-Inventory-stock-info-icon">
                <FiClipboard />
              </div>
              <div className="create-Inventory-stock-info-text">
                <span className="create-Inventory-stock-info-label">
                  Current Stock in Selected Bin
                </span>
                <span className="create-Inventory-stock-info-value">
                  {currentStockMock} Units
                </span>
              </div>
            </div>
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
                  type="number"
                  value={quantity?.toString()}
                  onChange={(e: any) => setQuantity(e)}
                />
                {errors.quantity && (
                  <span className="create-Inventory-stock-error">
                    {errors.quantity}
                  </span>
                )}
              </div>

              <div className="create-Inventory-stock-field">
                <label>
                  Expiry Date <span className="create-Inventory-stock-req">*</span>
                </label>
                <DashBoardInput
                  placeholder="dd-mm-yyyy"
                  type="date"
                  value={expiryDate ? expiryDate?.toFormat('dd-mm-yyyy') : ''}
                  onChange={(e: string) => { console.log(e); setExpiryDate(DateTime.fromJSDate(new Date(e)));}}
                />
                {errors.expiryDate && (
                  <span className="create-Inventory-stock-error">
                    {errors.expiryDate}
                  </span>
                )}
              </div>
            </div>

            <div className="create-Inventory-stock-field create-Inventory-stock-flex-grow">
              <label>
                Reason / Notes{" "}
                <span className="create-Inventory-stock-req">*</span>
              </label>
              <textarea
                className={`create-Inventory-stock-textarea ${errors.reason ? "error-border" : ""}`}
                placeholder="E.g., Inventory recount, received partial shipment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
                // onClick={handleSubmit}
                onClick={async () => {await new InventoryService().createInventory()}}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStock;
