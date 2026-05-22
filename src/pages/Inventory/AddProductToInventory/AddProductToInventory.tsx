import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AddProductToInventory.css';
import axios from "axios";
import { FiArrowLeft, FiX, FiPlusCircle, FiAlertCircle } from "react-icons/fi";
import { PiBatteryWarningVerticalFill } from "react-icons/pi";
import Loader2 from "../../../assets/loader/Loader2";
import Toast from "../../../assets/toast/Toast";
import SimpleModal from "../../../assets/simple_modal/SimpleModal";
import Dropdown from "../../../assets/dropdown/DropDown";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";

interface BinTableRow {
  id: string;
  binCode: string;
  maxQty: number;
  availableQty: number;
  addQty: string;
}

const AddProductToInventory: React.FC = () => {
  const navigate = useNavigate();

  // Core UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  
  // Form Selection States
  const [warehouseId, setWarehouseId] = useState<{ id: string, label: string; value: string }>();
  const [productId, setProductId] = useState<{ id: string, label: string; value: string }>();
  const [variantId, setVariantId] = useState<{ id: string, label: string; value: string }>();
  const [allocationMode, setAllocationMode] = useState<"manual" | "auto">("manual");
  
  // Auto Allocation States
  const [autoQty, setAutoQty] = useState<string>("");

  // Table Data States
  const [selectedBins, setSelectedBins] = useState<BinTableRow[]>([]);
  const [tableErrors, setTableErrors] = useState<{ [id: string]: string }>({});
  const [globalTableError, setGlobalTableError] = useState<string | null>(null);

  // Dropdown Options
  const [warehouseOptions, setWarehouseOptions] = useState<{ id: string, label: string; value: string }[]>([]);
  const [productOptions, setProductOptions] = useState<{ id: string, label: string; value: string }[]>([]);
  const [variantOptions, setVariantOptions] = useState<{ id: string, label: string; value: string }[]>([]);
  
  // Bin Dropdown State
  const [warehouseBinsOptions, setWarehouseBinsOptions] = useState<{ id: string; label: string; value: string; maxUnits: number; currentStock: number }[]>([]);
  const [selectedDropdownBin, setSelectedDropdownBin] = useState<{ id: string, label: string; value: string }>();

  // Calculate Totals dynamically
  const totalAllocated = selectedBins.reduce((acc, row) => acc + (Number(row.addQty) || 0), 0);

  // Fetch initial dropdown data (Simulated)
  useEffect(() => {
    // Populate mock options
    setWarehouseOptions([{ id: '', label: "Main Distribution Center (CA)", value: "wh_1" }]);
    setProductOptions([{ id: '', label: "Organic Raw Almonds", value: "prod_1" }]);
    setVariantOptions([{ id: '', label: "1kg Bag (SKU: ORG-ALM-1KG)", value: "var_1" }]);
    
    // Mock Bin Data that would come from API based on selected warehouse
    setWarehouseBinsOptions([
      { id: "bin_1", label: "BIN-A-01", value: "bin_1", maxUnits: 500, currentStock: 150 },
      { id: "bin_2", label: "BIN-B-04", value: "bin_2", maxUnits: 200, currentStock: 50 },
      { id: "bin_3", label: "BIN-C-12", value: "bin_3", maxUnits: 1000, currentStock: 900 },
    ]);
  }, []);

  // Handle Bin Selection from Dropdown (Manual Mode)
  useEffect(() => {
    if (selectedDropdownBin && allocationMode === "manual") {
      const binData = warehouseBinsOptions.find(b => b.value === selectedDropdownBin.value);
      if (binData && !selectedBins.find(b => b.id === binData.id)) {
        const available = binData.maxUnits - binData.currentStock;
        setSelectedBins(prev => [
          ...prev, 
          { 
            id: binData.id, 
            binCode: binData?.label, 
            maxQty: binData?.maxUnits, 
            availableQty: available, 
            addQty: "" 
          }
        ]);
        setGlobalTableError(null);
      }
      // Reset dropdown visual selection after adding
      setTimeout(() => setSelectedDropdownBin(null), 100); 
    }
  }, [selectedDropdownBin, allocationMode, warehouseBinsOptions, selectedBins]);

  // Handle Mode Switch Logic
  const handleModeSwitch = (mode: "manual" | "auto") => {
    if (mode === "manual" && allocationMode === "auto" && selectedBins.length > 0) {
      setOpenModal(true);
    } else if (mode === "auto") {
      setSelectedBins([]);
      setAllocationMode("auto");
      setGlobalTableError(null);
      setTableErrors({});
    } else {
      setAllocationMode("manual");
    }
  };

  const confirmSwitchToManual = (keepData: boolean) => {
    setOpenModal(false);
    setAllocationMode("manual");
    if (!keepData) {
      setSelectedBins([]);
      setGlobalTableError(null);
      setTableErrors({});
    }
  };

  // Handle Input in Table (Manual Mode)
  const handleTableInputChange = (id: string, value: string) => {
    if (allocationMode === "auto") return; // Disabled in auto
    
    setGlobalTableError(null);
    setSelectedBins(prev => prev.map(row => {
      if (row.id === id) {
        const numVal = Number(value);
        const newErrors = { ...tableErrors };
        
        if (numVal > row.availableQty) {
          newErrors[id] = `Cannot exceed ${row.availableQty}`;
        } else {
          delete newErrors[id];
        }
        
        setTableErrors(newErrors);
        return { ...row, addQty: value };
      }
      return row;
    }));
  };

  // Remove Row (Manual Mode)
  const handleRemoveRow = (id: string) => {
    if (allocationMode === "auto") return; // Disabled in auto
    setSelectedBins(prev => prev.filter(row => row.id !== id));
    
    // Cleanup errors
    const newErrors = { ...tableErrors };
    delete newErrors[id];
    setTableErrors(newErrors);
    setGlobalTableError(null);
  };

  // Auto Allocation Simulation
  const handleAutoAllocate = () => {
    if (!autoQty || Number(autoQty) <= 0) {
      setToast("Please enter a valid total quantity to allocate.");
      return;
    }

    setIsLoading(true);
    // Simulate API Call delay
    setTimeout(() => {
      const mockApiResult: BinTableRow[] = [
        { id: "bin_1", binCode: "BIN-A-01", maxQty: 500, availableQty: 350, addQty: "100" },
        { id: "bin_2", binCode: "BIN-B-04", maxQty: 200, availableQty: 150, addQty: "50" }
      ];
      setSelectedBins(mockApiResult);
      setTableErrors({});
      setGlobalTableError(null);
      setIsLoading(false);
    }, 800);
  };

  // Final Submit
  const handleSubmit = async () => {
    let isValid = true;
    let newErrors: { [id: string]: string } = {};

    if (!warehouseId || !productId || !variantId) {
      setToast("Please select Warehouse, Product, and Variant.");
      return;
    }

    if (selectedBins.length === 0) {
      setGlobalTableError("Please add at least one bin for allocation.");
      return;
    }

    // Validate Table Rows
    selectedBins.forEach(row => {
      if (!row.addQty || row.addQty.trim() === "" || Number(row.addQty) <= 0) {
        newErrors[row.id] = "Value required";
        isValid = false;
      } else if (Number(row.addQty) > row.availableQty) {
        newErrors[row.id] = `Exceeds max (${row.availableQty})`;
        isValid = false;
      }
    });

    if (!isValid) {
      setTableErrors(newErrors);
      setGlobalTableError("Please resolve the errors in the allocation table before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API POST
      console.log("Submitting Inventory Addition:", { warehouseId, productId, variantId, selectedBins });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate("/dashboard/inventory");
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response?.data?.isCommunicable) {
        setToast(error.response?.data?.error);
      } else {
        setToast("An unexpected error occurred while adding inventory.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <>
          {toast && (
            <Toast
              title={"Inventory Management"}
              description={toast}
              isError={true}
              duration={5000}
              onClose={() => setToast(null)}
            />
          )}

          {openModal && (
            <SimpleModal
              title={"Keep Auto-Allocated Data?"}
              subtitle={"You are switching to Manual mode. Would you like to keep the data fetched from the auto-allocation, or start from scratch?"}
              icon={<PiBatteryWarningVerticalFill />}
              isWarning={true}
              button1Name={"Start from Scratch"}
              button1OnClick={() => confirmSwitchToManual(false)}
              button2Name={"Keep Data"}
              button2OnClick={() => confirmSwitchToManual(true)}
              onOverlayClick={() => setOpenModal(false)}
            />
          )}

          <div className="create-add-product-to-inventory-container">
            {/* Header */}
            <div className="create-add-product-to-inventory-header-wrapper">
              <button className="create-add-product-to-inventory-back-btn" onClick={() => navigate("/dashboard/inventory")}>
                <FiArrowLeft /> Back to Inventory
              </button>
              <h1 className="create-add-product-to-inventory-title">Add Product To Inventory</h1>
            </div>

            {/* Section 1: Core Selectors */}
            <div className="create-add-product-to-inventory-card">
              <div className="create-add-product-to-inventory-grid-3">
                <div className="create-add-product-to-inventory-field">
                  <label>Select Warehouse <span className="req">*</span></label>
                  <Dropdown label={warehouseId?.label ?? 'Select Warehouse'} options={warehouseOptions} selected={warehouseId} onSelect={(val: any) => setWarehouseId(val)} />
                </div>
                <div className="create-add-product-to-inventory-field">
                  <label>Select Product <span className="req">*</span></label>
                  <Dropdown label={productId?.label ?? 'Select Product'} options={productOptions} selected={productId} onSelect={(val: any) => setProductId(val)} />
                </div>
                <div className="create-add-product-to-inventory-field">
                  <label>Select Variant <span className="req">*</span></label>
                  <Dropdown label={variantId?.label ?? 'Select Variant'} options={variantOptions} selected={variantId} onSelect={(val: any) => setVariantId(val)} />
                </div>
              </div>
            </div>

            {/* Section 2: Allocation Mode & Controls */}
            <div className="create-add-product-to-inventory-card">
              <div className="create-add-product-to-inventory-controls-row">
                
                {/* Radio Toggles */}
                <div className="create-add-product-to-inventory-field">
                  <label>Allocation Mode</label>
                  <div className="create-add-product-to-inventory-radio-group">
                    <label className="create-add-product-to-inventory-radio-label">
                      <input 
                        type="radio" 
                        name="allocationMode" 
                        checked={allocationMode === "manual"}
                        onChange={() => handleModeSwitch("manual")}
                      />
                      Manual
                    </label>
                    <label className="create-add-product-to-inventory-radio-label">
                      <input 
                        type="radio" 
                        name="allocationMode" 
                        checked={allocationMode === "auto"}
                        onChange={() => handleModeSwitch("auto")}
                      />
                      Auto
                    </label>
                  </div>
                </div>

                {/* Auto Mode specific inputs */}
                {allocationMode === "auto" && (
                  <div className="create-add-product-to-inventory-auto-controls">
                    <div className="create-add-product-to-inventory-field">
                      <label>Total Qty to Allocate <span className="req">*</span></label>
                    </div>
                    <div className="create-add-product-to-inventory-auto-btn">
                      <DashBoardInput 
                        type="number" 
                        value={autoQty} 
                        onChange={(e: any) => setAutoQty(e.target.value)} 
                        placeholder="0"
                      />
                       <DashBoardButton height={'54.5px'} name="Proceed To Allocation" variant="primary" onClick={handleAutoAllocate} />
                    </div>
                  </div>
                )}

                {/* Manual Mode specific inputs */}
                {allocationMode === "manual" && (
                  <div className="create-add-product-to-inventory-manual-controls">
                    <div className="create-add-product-to-inventory-field">
                      <label>Select Warehouse Bin</label>
                      <Dropdown 
                        options={warehouseBinsOptions}
                        label={selectedDropdownBin?.label ?? 'Select Warehouse Bin'} 
                        selected={selectedDropdownBin} 
                        onSelect={(val : any) => setSelectedDropdownBin(val)} 
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Section 3: Allocation Table */}
            <div className="create-add-product-to-inventory-table-section">
              <div className="create-add-product-to-inventory-table-header">
                <h3>Allocation Details</h3>
                <span className="create-add-product-to-inventory-total-chip">
                  <FiPlusCircle /> Total Quantity to Allocate: <strong>{totalAllocated}</strong>
                </span>
              </div>

              <div className="create-add-product-to-inventory-table-wrapper">
                <table className="create-add-product-to-inventory-table">
                  <thead>
                    <tr>
                      <th>SL.NO</th>
                      <th>BIN CODE</th>
                      <th>MAX QTY</th>
                      <th>AVAILABLE QTY</th>
                      <th>ADD QTY</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="create-add-product-to-inventory-empty-state">
                          No bins selected for allocation.
                        </td>
                      </tr>
                    ) : (
                      selectedBins.map((row, index) => (
                        <tr key={row.id}>
                          <td>{String(index + 1).padStart(2, '0')}</td>
                          <td className="create-add-product-to-inventory-highlight-text">{row.binCode}</td>
                          <td>{row.maxQty}</td>
                          <td>{row.availableQty}</td>
                          <td className="create-add-product-to-inventory-input-cell">
                            <div className="create-add-product-to-inventory-table-input-wrapper">
                              <input 
                                type="number" 
                                value={row.addQty} 
                                onChange={(e) => handleTableInputChange(row.id, e.target.value)}
                                disabled={allocationMode === "auto"}
                                className={tableErrors[row.id] ? "error-input" : ""}
                              />
                              {tableErrors[row.id] && (
                                <span className="create-add-product-to-inventory-cell-error">{tableErrors[row.id]}</span>
                              )}
                            </div>
                          </td>
                          <td className="create-add-product-to-inventory-action-cell">
                             <button 
                               className="create-add-product-to-inventory-remove-btn" 
                               onClick={() => handleRemoveRow(row.id)}
                               disabled={allocationMode === "auto"}
                             >
                               <FiX />
                             </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="create-add-product-to-inventory-footer-label">Allocated Total:</td>
                      <td colSpan={2} className="create-add-product-to-inventory-footer-value">{totalAllocated}</td>
                    </tr>
                  </tfoot>
                </table>
                
                {/* Global Table Error */}
                {globalTableError && (
                  <div className="create-add-product-to-inventory-global-error">
                    <FiAlertCircle /> {globalTableError}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="create-add-product-to-inventory-footer-actions">
              <DashBoardButton 
                name="Cancel" 
                variant="secondary" 
                onClick={() => navigate("/dashboard/inventory")} 
              />
              <DashBoardButton 
                name="Add Inventory" 
                variant="primary" 
                onClick={handleSubmit} 
                disabled={isLoading} 
              />
            </div>

          </div>
        </>
      )}
    </>
  );
};

export default AddProductToInventory;