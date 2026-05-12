import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClipboard } from "react-icons/fi";

import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./ManageStock.css";

export enum InventoryAction {
  ADJUST = "adjust",
  WASTE = "waste",
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
  }>({ id: "", label: "Adjust Stock", value: InventoryAction.ADJUST });

  // Current Status States
  const [warehouseId, setWarehouseId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: "", label: "Select Warehouse", value: "" });
  const [binId, setBinId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: "", label: "Select Warehouse", value: "" });
  const [productId, setProductId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: "", label: "Select Warehouse", value: "" });
  const [variantId, setVariantId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: "", label: "Select Warehouse", value: "" });

  // Details States
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>(
    AdjustmentType.ADD,
  );
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock Data (Would typically come from API)
  const currentStockMock = 450;

  const actionOptions = [
    { id: "", label: "Adjust Stock", value: InventoryAction.ADJUST },
    { id: "", label: "Manage Waste", value: InventoryAction.WASTE },
  ];

  const mockWarehouses = [
    { id: "", label: "Main Distribution Center (CA)", value: "wh_1" },
  ];
  const mockBins = [
    { id: "", label: "Aisle 4, Shelf B (Dry Goods)", value: "bin_1" },
  ];
  const mockProducts = [
    { id: "", label: "Organic Raw Almonds", value: "prod_1" },
  ];
  const mockVariants = [
    { id: "", label: "1kg Bag (SKU: ORG-ALM-1KG)", value: "var_1" },
  ];

  // Side-effect: Force 'Reduce' if switching to Waste management
  useEffect(() => {
    if (actionType.label === InventoryAction.WASTE) {
      setAdjustmentType(AdjustmentType.REDUCE);
    }
  }, [actionType]);

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

      console.log("Submitting Inventory Update:", payload);
      // Simulate API call
      // await axios.post('/api/inventory/adjust', payload);

      navigate("/dashboard/inventory");
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
          {(actionType.label as any) === InventoryAction.ADJUST
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
            onSelect={(val) => setActionType(val as any)}
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
                options={mockWarehouses}
                label={warehouseId.label || "Select Warehouse"}
                onSelect={(val: any) => setWarehouseId}
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
                options={mockBins}
                label={binId.label || "Select Bin"}
                onSelect={(val: any) => setBinId}
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
                options={mockProducts}
                label={productId.label || "Select Product"}
                onSelect={(val: any) => setProductId}
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
                options={mockVariants}
                label={variantId.label || "Select Variant"}
                onSelect={(val: any) => setVariantId}
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
            {actionType.label === InventoryAction.ADJUST
              ? "Adjustment Details"
              : "Manage Waste Details"}
          </h2>

          <div className="create-Inventory-stock-form-col">
            <div className="create-Inventory-stock-row-split">
              <div className="create-Inventory-stock-field">
                <label>
                  {actionType.label === InventoryAction.ADJUST
                    ? "Adjustment Type"
                    : "Waste Type"}{" "}
                  <span className="create-Inventory-stock-req">*</span>
                </label>
                <div className="create-Inventory-stock-radio-group">
                  {actionType.label === InventoryAction.ADJUST && (
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
                  value={quantity}
                  onChange={(e: any) => setQuantity(e.target.value)}
                />
                {errors.quantity && (
                  <span className="create-Inventory-stock-error">
                    {errors.quantity}
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
                onClick={handleSubmit}
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
