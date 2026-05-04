import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiX,
  FiUploadCloud,
  FiBox,
  FiMapPin,
  FiLayers,
} from "react-icons/fi";

import DashBoardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../assets/dropdown/DropDown";
import "./CreateOrEditWareHouse.css";

// --- Enums & Entities ---
export enum WarehouseType {
  OWN = "own",
  RENTED = "rented",
}

export enum WarehouseStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
}

export enum CapacityUnit {
  UNITS = "units",
  CUBIC_METERS = "cubic_meters",
  PALLETS = "pallets",
}

export class Warehouse {
  id?: string;
  code?: string;
  name?: string;
  type?: WarehouseType;
  status?: WarehouseStatus;
  address?: string; // Simplified for the form
  totalCapacity?: number;
  capacityUnit?: CapacityUnit;
  image?: string; // Added to support the requested image upload
}

export class WarehouseBin {
  id?: string;
  warehouse?: Warehouse;
  binCode?: string;
  aisle?: string;
  rack?: string;
  level?: string;
  maxUnits?: number;
  isActive?: boolean;
}

const CreateOrEditWareHouse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // General States
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(""); // The user select field mentioned
  const [code, setCode] = useState("");
  const [type, setType] = useState<WarehouseType | "">("");
  const [status, setStatus] = useState<WarehouseStatus | "">("");
  const [address, setAddress] = useState("");

  // Capacity States
  const [totalCapacity, setTotalCapacity] = useState("");
  const [capacityUnit, setCapacityUnit] = useState<CapacityUnit | "">("");

  // Initial Bin / Layout States
  const [aisle, setAisle] = useState("");
  const [rack, setRack] = useState("");
  const [level, setLevel] = useState("");
  const [maxUnits, setMaxUnits] = useState("");

  // Image States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dropdown Options
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const typeOptions = [
    { label: "Owned", value: WarehouseType.OWN },
    { label: "Rented", value: WarehouseType.RENTED },
  ];
  const statusOptions = [
    { label: "Active", value: WarehouseStatus.ACTIVE },
    { label: "Inactive", value: WarehouseStatus.INACTIVE },
    { label: "Under Maintenance", value: WarehouseStatus.MAINTENANCE },
  ];
  const unitOptions = [
    { label: "Units", value: CapacityUnit.UNITS },
    { label: "Cubic Meters", value: CapacityUnit.CUBIC_METERS },
    { label: "Pallets", value: CapacityUnit.PALLETS },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch users for the manager/user select dropdown
    axios
      .get("/api/users")
      .then((res) =>
        setUserOptions(
          res.data.map((u: any) => ({
            label: u.name || `User ${u.id}`,
            value: u.id,
          })),
        ),
      )
      .catch(() =>
        setUserOptions([
          { label: "Admin User", value: "usr_1" },
          { label: "Manager User", value: "usr_2" },
        ]),
      );

    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`/api/warehouses/${id}`)
        .then((res) => {
          const wh: Warehouse = res.data;
          setName(wh.name || "");
          setCode(wh.code || "");
          setType(wh.type || "");
          setStatus(wh.status || "");
          setAddress(wh.address || "");
          setTotalCapacity(wh.totalCapacity?.toString() || "");
          setCapacityUnit(wh.capacityUnit || "");
          setImagePreview(wh.image || null);

          // Assuming the API returns the initial bin setup for edit
          if (res.data.initialBin) {
            setAisle(res.data.initialBin.aisle || "");
            setRack(res.data.initialBin.rack || "");
            setLevel(res.data.initialBin.level || "");
            setMaxUnits(res.data.initialBin.maxUnits?.toString() || "");
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  // Image Handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 2MB",
        }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submission
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Required";
    if (!userId) newErrors.userId = "Required";
    if (!code.trim()) newErrors.code = "Required";
    if (!type) newErrors.type = "Required";
    if (!status) newErrors.status = "Required";
    if (!address.trim()) newErrors.address = "Required";
    if (!totalCapacity) newErrors.totalCapacity = "Required";
    if (!capacityUnit) newErrors.capacityUnit = "Required";
    if (!aisle) newErrors.aisle = "Required";
    if (!rack) newErrors.rack = "Required";
    if (!level) newErrors.level = "Required";
    if (!maxUnits) newErrors.maxUnits = "Required";
    if (!imagePreview && !imageFile) newErrors.image = "Image required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userId", userId);
      formData.append("code", code);
      formData.append("type", type);
      formData.append("status", status);
      formData.append("address", address);
      formData.append("totalCapacity", totalCapacity);
      formData.append("capacityUnit", capacityUnit);

      // Bin Configuration
      formData.append("aisle", aisle);
      formData.append("rack", rack);
      formData.append("level", level);
      formData.append("maxUnits", maxUnits);

      if (imageFile) formData.append("image", imageFile);

      if (isEditMode) {
        await axios.put(`/api/warehouses/${id}`, formData);
      } else {
        await axios.post("/api/warehouses", formData);
      }

      navigate("/dashboard/warehouses"); // Assuming the list route
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, submit: "Failed to save warehouse." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-warehouse-container">
      {/* Header */}
      <div className="create-warehouse-header-wrapper">
        <div className="create-warehouse-title-area">
          <button
            className="create-warehouse-back-btn"
            onClick={() => navigate("/dashboard/warehouses")}
          >
            <FiArrowLeft /> Back to Warehouses
          </button>
          <h1 className="create-warehouse-title">
            {isEditMode ? "Edit Warehouse" : "Add New Warehouse"}
          </h1>
          <p className="create-warehouse-subtitle">
            Configure storage locations and initial bin infrastructure.
          </p>
        </div>
      </div>

      <div className="create-warehouse-sections-wrapper">
        {/* Section 1: Core Details */}
        <div className="create-warehouse-card">
          <div className="create-warehouse-card-header">
            <FiBox className="create-warehouse-header-icon" />
            <h2>Warehouse Details</h2>
          </div>

          <div className="create-warehouse-card-body">
            <div className="create-warehouse-field-group">
              <label>
                Warehouse Name <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="e.g. Central Hub Chennai"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
              {errors.name && (
                <span className="create-warehouse-error">{errors.name}</span>
              )}
            </div>

            <div className="create-warehouse-field-group">
              <label>
                Warehouse Manager / Linked User <span className="req">*</span>
              </label>
              <Dropdown
                options={userOptions}
                value={userId}
                onChange={(val: any) => setUserId(val)}
                placeholder="Select responsible user..."
              />
              {errors.userId && (
                <span className="create-warehouse-error">{errors.userId}</span>
              )}
            </div>

            <div className="create-warehouse-row-split">
              <div className="create-warehouse-field-group">
                <label>
                  Warehouse Code <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="e.g. WH-CHN-01"
                  value={code}
                  onChange={(e: any) => setCode(e.target.value)}
                />
                {errors.code && (
                  <span className="create-warehouse-error">{errors.code}</span>
                )}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Ownership Type <span className="req">*</span>
                </label>
                <Dropdown
                  options={typeOptions}
                  value={type}
                  onChange={(val: any) => setType(val as WarehouseType)}
                  placeholder="Select type..."
                />
                {errors.type && (
                  <span className="create-warehouse-error">{errors.type}</span>
                )}
              </div>
            </div>

            <div className="create-warehouse-row-split">
              <div className="create-warehouse-field-group">
                <label>
                  Operational Status <span className="req">*</span>
                </label>
                <Dropdown
                  options={statusOptions}
                  value={status}
                  onChange={(val: any) => setStatus(val as WarehouseStatus)}
                  placeholder="Select status..."
                />
                {errors.status && (
                  <span className="create-warehouse-error">
                    {errors.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Capacity */}
        <div className="create-warehouse-card">
          <div className="create-warehouse-card-header">
            <FiMapPin className="create-warehouse-header-icon" />
            <h2>Location & Capacity</h2>
          </div>

          <div className="create-warehouse-card-body">
            <div className="create-warehouse-field-group">
              <label>
                Full Address <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="Enter complete physical address"
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
              />
              {errors.address && (
                <span className="create-warehouse-error">{errors.address}</span>
              )}
            </div>

            <div className="create-warehouse-row-split">
              <div className="create-warehouse-field-group">
                <label>
                  Total Capacity <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="0"
                  value={totalCapacity}
                  onChange={(e: any) => setTotalCapacity(e.target.value)}
                  type="number"
                />
                {errors.totalCapacity && (
                  <span className="create-warehouse-error">
                    {errors.totalCapacity}
                  </span>
                )}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Capacity Unit <span className="req">*</span>
                </label>
                <Dropdown
                  options={unitOptions}
                  value={capacityUnit}
                  onChange={(val: any) => setCapacityUnit(val as CapacityUnit)}
                  placeholder="Select unit..."
                />
                {errors.capacityUnit && (
                  <span className="create-warehouse-error">
                    {errors.capacityUnit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Initial Bin Configuration */}
        <div className="create-warehouse-card">
          <div className="create-warehouse-card-header">
            <FiLayers className="create-warehouse-header-icon" />
            <h2>Initial Bin Infrastructure</h2>
          </div>

          <div className="create-warehouse-card-body">
            <div className="create-warehouse-row-split">
              <div className="create-warehouse-field-group">
                <label>
                  Aisle <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="e.g. A01"
                  value={aisle}
                  onChange={(e: any) => setAisle(e.target.value)}
                />
                {errors.aisle && (
                  <span className="create-warehouse-error">{errors.aisle}</span>
                )}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Rack <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="e.g. R02"
                  value={rack}
                  onChange={(e: any) => setRack(e.target.value)}
                />
                {errors.rack && (
                  <span className="create-warehouse-error">{errors.rack}</span>
                )}
              </div>
            </div>

            <div className="create-warehouse-row-split">
              <div className="create-warehouse-field-group">
                <label>
                  Level <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="e.g. L3"
                  value={level}
                  onChange={(e: any) => setLevel(e.target.value)}
                />
                {errors.level && (
                  <span className="create-warehouse-error">{errors.level}</span>
                )}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Max Units (per Bin) <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="0"
                  value={maxUnits}
                  onChange={(e: any) => setMaxUnits(e.target.value)}
                  type="number"
                />
                {errors.maxUnits && (
                  <span className="create-warehouse-error">
                    {errors.maxUnits}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Facility Image */}
        <div className="create-warehouse-card">
          <div className="create-warehouse-card-header">
            <FiUploadCloud className="create-warehouse-header-icon" />
            <h2>Facility Image</h2>
          </div>

          <div className="create-warehouse-card-body">
            <div
              className={`create-warehouse-upload-area ${errors.image ? "error-border" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="create-warehouse-preview-wrapper">
                  <img src={imagePreview} alt="Facility Preview" />
                  <button
                    className="create-warehouse-remove-img"
                    onClick={removeImage}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="create-warehouse-upload-placeholder">
                  <div className="create-warehouse-upload-icon-wrapper">
                    <FiUploadCloud className="create-warehouse-upload-icon" />
                  </div>
                  <span className="create-warehouse-upload-title">
                    Click to upload warehouse photo
                  </span>
                  <span className="create-warehouse-upload-subtitle">
                    JPG or PNG up to 2MB
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            {errors.image && (
              <span className="create-warehouse-error">{errors.image}</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="create-warehouse-footer">
        <DashBoardButton
          name="Cancel"
          variant="secondary"
          onClick={() => navigate("/dashboard/warehouses")}
        />
        <DashBoardButton
          name={isEditMode ? "Save Changes" : "Create Warehouse"}
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateOrEditWareHouse;
