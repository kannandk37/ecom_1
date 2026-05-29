import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProductsToInventory.css";
import axios from "axios";
import { FiArrowLeft, FiX, FiPlusCircle, FiAlertCircle } from "react-icons/fi";
import { PiBatteryWarningVerticalFill } from "react-icons/pi";
import Toast from "../../../../assets/toast/Toast";
import SimpleModal from "../../../../assets/simple_modal/SimpleModal";
import Dropdown from "../../../../assets/dropdown/DropDown";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import { WarehouseService } from "../../../../service/warehouse";
import { Warehouse } from "../../../../entity/warehouse";
import { ProductService } from "../../../../service/product";
import { Product } from "../../../../entity/product";
import { Variant } from "../../../../entity/variant";
import { WarehouseBinService } from "../../../../service/warehouse_bin";
import { WarehouseBin } from "../../../../entity/warehouse_bin";
import { InventoryService } from "../../../../service/inventory";
import { Inventory } from "../../../../entity/inventory";
import Loader2 from "../../../../assets/loader/Loader2";

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
  const [warehouseId, setWarehouseId] = useState<{
    id: string;
    label: string;
    value: string;
  }>();
  const [productId, setProductId] = useState<{
    id: string;
    label: string;
    value: string;
  }>();
  const [variantId, setVariantId] = useState<{
    id: string;
    label: string;
    value: string;
  }>();
  const [allocationMode, setAllocationMode] = useState<"manual" | "auto">(
    "manual",
  );

  // Auto Allocation States
  const [autoQty, setAutoQty] = useState<string>("");
  const [reservedQty, setReservedQty] = useState<string>("");
  const [reservedQtyError, setReservedQtyError] = useState<string>("");

  // Table Data States
  const [selectedBins, setSelectedBins] = useState<BinTableRow[]>([]);
  const [tableErrors, setTableErrors] = useState<{ [id: string]: string }>({});
  const [globalTableError, setGlobalTableError] = useState<string | null>(null);

  // Dropdown Options
  const [warehouseOptions, setWarehouseOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [productOptions, setProductOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [variantOptions, setVariantOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const [allWarehouseData, setAllWarehouseData] = useState<Warehouse[]>([]);
  const [allProductData, setAllProductData] = useState<
    Product[]
  >([]);
  const [allProductVariantData, setAllProductVariantData] = useState<Variant[]>(
    [],
  );

  // Bin Dropdown State
  const [warehouseBinsOptions, setWarehouseBinsOptions] = useState<
    {
      id: string;
      label: string;
      value: string;
      maxUnits: number;
      currentStock: number;
    }[]
  >([]);
  const [selectedDropdownBin, setSelectedDropdownBin] = useState<{
    id: string;
    label: string;
    value: string;
  }>();

  // Calculate Totals dynamically
  const totalAllocated = selectedBins.reduce(
    (acc, row) => acc + (Number(row.addQty) || 0),
    0,
  );

  const [isWarehouseLoading, setIsWarehouseLoading] = useState<boolean>(true);
  const [isBinLoading, setIsBinLoading] = useState<boolean>(false);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [isVariantLoading, setIsVariantLoading] = useState<boolean>(false);

  // Fetch initial dropdown data (Simulated)
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setIsWarehouseLoading(true);
      try {
        let warehousesData = await new WarehouseService().getAllWarehouses();
        if (warehousesData?.length > 0) {
          setAllWarehouseData(warehousesData);
          let warehousesDataOptions = warehousesData.map(
            (warehouse: Warehouse) => {
              return {
                id: warehouse.id,
                label: warehouse.name,
                value: warehouse.name,
              };
            },
          );
          setWarehouseOptions(warehousesDataOptions);
        } else {
          setWarehouseOptions([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setProductId(null);
        setVariantId(null);
        setSelectedBins([]);
        setIsWarehouseLoading(false);
        setIsLoading(false);
      };

      try {
        setIsProductLoading(true);
        let productsData = await new ProductService().get();
        if (productsData?.length > 0) {
          setAllProductData(productsData);
          let productsDataOptions = productsData.map((product: Product) => {
            return {
              id: product.id,
              label: product.name,
              value: product.name,
            };
          });
          setProductOptions(productsDataOptions);
        } else {
          setProductOptions([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsProductLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (warehouseId?.id) {
        try {
          setIsBinLoading(true);
          let warehouseBinsData =
            await new WarehouseBinService().getWarehouseBinsByWareHouseId(
              warehouseId?.id,
            );
          if (warehouseBinsData?.length > 0) {
            warehouseBinsData = warehouseBinsData.filter(
              (warehouseBin: WarehouseBin) =>
                (warehouseBin.maxUnits ?? 0) -
                (warehouseBin.currentStock ?? 0) >
                0,
            );
            let warehouseBinsDataOptions = warehouseBinsData.map(
              (warehouseBin: WarehouseBin) => {
                return {
                  id: warehouseBin.id,
                  label: warehouseBin.binCode,
                  value: warehouseBin.binCode,
                  maxUnits: warehouseBin.maxUnits,
                  currentStock: warehouseBin.currentStock,
                };
              },
            );
            setWarehouseBinsOptions(warehouseBinsDataOptions);
          } else {
            setWarehouseBinsOptions([]);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsBinLoading(false);
        }
      } else {
        setProductId(null);
        setVariantId(null);
        setSelectedBins([]);
        setProductOptions([]);
        setWarehouseBinsOptions([]);
      }
    })();
  }, [warehouseId]);

  useEffect(() => {
    (async () => {
      if (productId?.id) {
        setIsVariantLoading(true);
        try {
          let variantsData = allProductData.find((product: Product) => productId?.id == product.id)?.variants;
          if (variantsData?.length > 0) {
            let variantsDataOptions = variantsData.map((variant: Variant) => {
              return {
                id: variant.id,
                label: variant.name,
                value: variant.name,
              };
            });
            setVariantOptions(variantsDataOptions);
          } else {
            setVariantOptions([]);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsVariantLoading(false);
        }
      } else {
        setVariantId(null);
        setSelectedBins([]);
        setVariantOptions([]);
      }
    })();
  }, [productId]);

  // Handle Bin Selection from Dropdown (Manual Mode)
  useEffect(() => {
    if (selectedDropdownBin && allocationMode === "manual") {
      const binData = warehouseBinsOptions.find(
        (b) => b.value === selectedDropdownBin.value,
      );
      if (binData && !selectedBins.find((b) => b.id === binData.id)) {
        const available = binData.maxUnits - binData.currentStock;
        setSelectedBins((prev) => [
          ...prev,
          {
            id: binData.id,
            binCode: binData?.label,
            maxQty: binData?.maxUnits,
            availableQty: available,
            addQty: "",
          },
        ]);
        setGlobalTableError(null);
      }
      // Reset dropdown visual selection after adding
      setTimeout(() => setSelectedDropdownBin(null), 100);
    }
  }, [selectedDropdownBin, allocationMode, warehouseBinsOptions, selectedBins]);

  // Handle Mode Switch Logic
  const handleModeSwitch = (mode: "manual" | "auto") => {
    if (
      mode === "manual" &&
      allocationMode === "auto" &&
      selectedBins.length > 0
    ) {
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
    setSelectedBins((prev) =>
      prev.map((row) => {
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
      }),
    );
  };

  // Remove Row (Manual Mode)
  const handleRemoveRow = (id: string) => {
    if (allocationMode === "auto") return; // Disabled in auto
    setSelectedBins((prev) => prev.filter((row) => row.id !== id));

    // Cleanup errors
    const newErrors = { ...tableErrors };
    delete newErrors[id];
    setTableErrors(newErrors);
    setGlobalTableError(null);
  };

  // Auto Allocation Simulation
  const handleAutoAllocate = async () => {
    if (!autoQty || Number(autoQty) <= 0) {
      setToast("Please enter a valid total quantity to allocate.");
      return;
    }

    setIsLoading(true);

    let warehouse = new Warehouse();
    warehouse.id = warehouseId.id;

    let product = new Product();
    product.id = productId.id;

    let variant = new Variant();
    if (variantId?.id) {
      variant.id = variantId.id;
    }

    try {
      let response = await new WarehouseBinService().allocateWarehouseBins(
        warehouse,
        product,
        Number(autoQty),
        variant,
      );

      if (response.shortfall > 0) {
        setGlobalTableError(
          "Unable To Fill The Total Quantity Free Up Some Rack",
        );
        setToast("Unable To Fill The Total Quantity Free Up Some Rack");
      }

      const apiResult: BinTableRow[] = response?.allocations?.map(
        (warehouseBin: WarehouseBin) => {
          return {
            id: warehouseBin.id,
            binCode: warehouseBin.binCode,
            maxQty: warehouseBin.maxUnits,
            availableQty: warehouseBin.currentStock,
            addQty: warehouseBin.currentStock?.toString(),
          };
        },
      );
      setSelectedBins(apiResult);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response?.data?.isCommunicable) {
        setToast(error.response?.data?.error);
      } else {
        setToast("An unexpected error occurred while adding inventory.");
      }
    }
  };

  function isValidData() {
    if (!reservedQty) {
      setReservedQtyError('Please Enter Reserved Qty');
    } else if (Number(reservedQty) > Number(selectedBins.reduce((sum, selectedBin) => sum + Number(selectedBin.addQty), 0))) {
      setReservedQtyError('Reserved Qty Cannot Be Lower Than The Total Qty');
    } else {
      return true;
    }
    return false;
  }

  // Final Submit
  const handleSubmit = async () => {
    let isValid: boolean = isValidData();
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
    selectedBins.forEach((row) => {
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
      setGlobalTableError(
        "Please resolve the errors in the allocation table before submitting.",
      );
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API POST
      console.log("Submitting Inventory Addition:", {
        warehouseId,
        productId,
        variantId,
        selectedBins,
      });

      let inventory = new Inventory();

      let warehouse = new Warehouse();
      warehouse.id = warehouseId?.id;

      let totalCount = 0;
      let warehouseBins = selectedBins.map((selectedBin) => {
        let warehouseBin = new WarehouseBin();
        warehouseBin.id = selectedBin.id;
        warehouseBin.currentStock = Number(selectedBin.addQty);
        totalCount = totalCount + Number(selectedBin.addQty);
        return warehouseBin
      });

      let product = new Product();
      product.id = productId?.id;

      let variant = new Variant();
      variant.id = variantId?.id;

      let qty = allocationMode == 'auto' ? Number(autoQty) : 10;

      inventory.product = product;
      inventory.variant = variant;
      inventory.warehouse = warehouse;
      inventory.qtyOnHand = totalCount;
      inventory.warehouseBins = warehouseBins;
      inventory.qtyReserved = reservedQty ? Number(reservedQty) : 0;
      inventory.maxStockLevel = qty;
      await new InventoryService().createInventory(inventory);

      navigate("/dashboard/inventories");
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

  const availableBinOptions = warehouseBinsOptions.filter(
    (bin) => !selectedBins.some((selected) => selected.id === bin.id),
  );

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
              subtitle={
                "You are switching to Manual mode. Would you like to keep the data fetched from the auto-allocation, or start from scratch?"
              }
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
              <button
                className="create-add-product-to-inventory-back-btn"
                onClick={() => navigate("/dashboard/inventories")}
              >
                <FiArrowLeft /> Back to Inventory
              </button>
              <h1 className="create-add-product-to-inventory-title">
                Add Product To Inventory
              </h1>
            </div>

            {/* Section 1: Core Selectors */}
            <div className="create-add-product-to-inventory-card">
              <div className="create-add-product-to-inventory-grid-3">
                <div className="create-add-product-to-inventory-field">
                  <label>
                    Select Warehouse <span className="req">*</span>
                  </label>
                  <Dropdown
                    noData={warehouseOptions?.length > 0 ? false : true}
                    isLoading={isWarehouseLoading}
                    label={warehouseId?.label ?? "Select Warehouse"}
                    options={warehouseOptions}
                    selected={warehouseId}
                    onSelect={(val: any) => setWarehouseId(val)}
                  />
                </div>
                <div className="create-add-product-to-inventory-field">
                  <label>
                    Select Product <span className="req">*</span>
                  </label>
                  <Dropdown
                    noData={productOptions?.length > 0 ? false : true}
                    isLoading={isProductLoading}
                    label={productId?.label ?? "Select Product"}
                    options={productOptions}
                    selected={productId}
                    onSelect={(val: any) => setProductId(val)}
                  />
                </div>
                <div className="create-add-product-to-inventory-field">
                  <label>
                    Select Variant <span className="req">*</span>
                  </label>
                  <Dropdown
                    noData={variantOptions?.length > 0 ? false : true}
                    isLoading={isVariantLoading}
                    label={variantId?.label ?? "Select Variant"}
                    options={variantOptions}
                    selected={variantId}
                    onSelect={(val: any) => setVariantId(val)}
                  />
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
                      <label>
                        Total Qty to Allocate <span className="req">*</span>
                      </label>
                    </div>
                    <div className="create-add-product-to-inventory-auto-btn">
                      <DashBoardInput
                        type="text"
                        value={autoQty}
                        onChange={(e: any) => {setAutoQty(e); setGlobalTableError(null)}}
                        placeholder="0"
                      />
                      <DashBoardButton
                        height={"54.5px"}
                        name="Proceed To Allocation"
                        variant="primary"
                        onClick={handleAutoAllocate}
                      />
                    </div>
                  </div>
                )}

                {/* Manual Mode specific inputs */}
                {allocationMode === "manual" && (
                  <div className="create-add-product-to-inventory-manual-controls">
                    <div className="create-add-product-to-inventory-field">
                      <label>Select Warehouse Bin</label>
                      <Dropdown
                        noData={warehouseBinsOptions?.length > 0 ? false : true}
                        isLoading={isBinLoading}
                        options={availableBinOptions}
                        label={
                          selectedDropdownBin?.label ?? "Select Warehouse Bin"
                        }
                        selected={selectedDropdownBin}
                        onSelect={(val: any) => setSelectedDropdownBin(val)}
                      />
                    </div>
                  </div>
                )}
                <div className="create-add-product-to-inventory-field">
                  <label>Reserved Qty</label>
                  <DashBoardInput
                    type="text"
                    value={reservedQty}
                    onChange={(e: any) => { setReservedQty(e); setReservedQtyError(null); setGlobalTableError(null); }}
                    placeholder="0"
                    required={true}
                    error={reservedQtyError ? true : false}
                    errorMessage={reservedQtyError}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Allocation Table */}
            <div className="create-add-product-to-inventory-table-section">
              <div className="create-add-product-to-inventory-table-header">
                <h3>Allocation Details</h3>
                <span className="create-add-product-to-inventory-total-chip">
                  <FiPlusCircle /> Total Quantity to Allocate:{" "}
                  <strong>{totalAllocated}</strong>
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
                        <td
                          colSpan={6}
                          className="create-add-product-to-inventory-empty-state"
                        >
                          No bins selected for allocation.
                        </td>
                      </tr>
                    ) : (
                      selectedBins.map((row, index) => (
                        <tr key={row.id}>
                          <td>{String(index + 1).padStart(2, "0")}</td>
                          <td className="create-add-product-to-inventory-highlight-text">
                            {row.binCode}
                          </td>
                          <td>{row.maxQty}</td>
                          <td>{row.availableQty}</td>
                          <td className="create-add-product-to-inventory-input-cell">
                            <div className="create-add-product-to-inventory-table-input-wrapper">
                              <input
                                type="number"
                                value={row.addQty}
                                onChange={(e) =>
                                  handleTableInputChange(row.id, e.target.value)
                                }
                                disabled={allocationMode === "auto"}
                                className={
                                  tableErrors[row.id] ? "error-input" : ""
                                }
                              />
                              {tableErrors[row.id] && (
                                <span className="create-add-product-to-inventory-cell-error">
                                  {tableErrors[row.id]}
                                </span>
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
                      <td
                        colSpan={4}
                        className="create-add-product-to-inventory-footer-label"
                      >
                        Allocated Total:
                      </td>
                      <td
                        colSpan={2}
                        className="create-add-product-to-inventory-footer-value"
                      >
                        {totalAllocated}
                      </td>
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
                onClick={() => navigate("/dashboard/inventories")}
                width={"280px"}
              />
              <DashBoardButton
                name="Add To Inventory"
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading || globalTableError || selectedBins?.length <= 0 ? true : false}
                width={"280px"}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddProductToInventory;
