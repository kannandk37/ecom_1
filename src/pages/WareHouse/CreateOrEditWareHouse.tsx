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
import { ProfileService } from "../../service/profile";

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

// Indian states list for the state dropdown
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export class Warehouse {
  id?: string;
  code?: string;
  name?: string;
  type?: WarehouseType;
  status?: WarehouseStatus;
  address?: string; // Simplified for the form
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mobile?: string;
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
  const [userId, setUserId] = useState<{ id: string, label: string; value: string }>({ id: '1', label: 'tester', value: 'tester' }); // The user select field mentioned
  const [code, setCode] = useState("");
  const [type, setType] = useState<{ id: WarehouseType, label: WarehouseType; value: WarehouseType }>(null);
  const [status, setStatus] = useState<{ id: WarehouseStatus, label: WarehouseStatus; value: WarehouseStatus }>(null);
  const [address, setAddress] = useState(""); // kept for backward compat

  // Expanded Address States
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<{ id: string; label: string; value: string }>(null);
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");

  // Capacity States
  const [totalCapacity, setTotalCapacity] = useState("");
  const [capacityUnit, setCapacityUnit] = useState<{ id: CapacityUnit, label: CapacityUnit; value: CapacityUnit }>(null);

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
  // const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dropdown Options
  const [userOptions, setUserOptions] = useState<
    { id: string, label: string; value: string }[]
  >([]);

  const typeOptions = [
    { id: '', label: "Owned", value: WarehouseType.OWN },
    { id: '', label: "Rented", value: WarehouseType.RENTED },
  ];
  const statusOptions = [
    { id: '', label: "Active", value: WarehouseStatus.ACTIVE },
    { id: '', label: "Inactive", value: WarehouseStatus.INACTIVE },
    { id: '', label: "Under Maintenance", value: WarehouseStatus.MAINTENANCE },
  ];
  const unitOptions = [
    { id: '', label: "Units", value: CapacityUnit.UNITS },
    { id: '', label: "Cubic Meters", value: CapacityUnit.CUBIC_METERS },
    { id: '', label: "Pallets", value: CapacityUnit.PALLETS },
  ];

  // State dropdown options derived from INDIAN_STATES
  const stateOptions = INDIAN_STATES.map((s) => ({
    id: s,
    label: s,
    value: s,
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
    // Fetch users for the manager/user select dropdown

    (async () => {
      let profiles = await new ProfileService().get();
      console.log('profiles', profiles);
      profiles.map((u: any) => ({
        id: u.id,
        label: u.name,
        value: u.id,
      }))
    })()
    // axios
    //   .get("/api/users")
    //   .then((res) =>
    //     setUserOptions(
    //       res.data.map((u: any) => ({
    //         label: u.name || `User ${u.id}`,
    //         value: u.id,
    //       })),
    //     ),
    //   )
    //   .catch(() =>
    //     setUserOptions([
    //       { id: '', label: "Admin User", value: "usr_1" },
    //       { id: '', label: "Manager User", value: "usr_2" },
    //     ]),
    //   );

    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`/api/warehouses/${id}`)
        .then((res) => {
          const wh: Warehouse = res.data;
          setName(wh.name || "");
          setCode(wh.code || "");
          // setType(wh.type || "");
          // setStatus(wh.status || "");
          setAddress(wh.address || "");
          setAddressLine1(wh.addressLine1 || "");
          setAddressLine2(wh.addressLine2 || "");
          setCity(wh.city || "");
          setState(wh.state ? { id: wh.state, label: wh.state, value: wh.state } : null);
          setPincode(wh.pincode || "");
          setMobile(wh.mobile || "");
          setTotalCapacity(wh.totalCapacity?.toString() || "");
          // setCapacityUnit(wh.capacityUnit || "");
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
        // setErrors((prev) => ({
        //   ...prev,
        //   image: "File size must be less than 2MB",
        // }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // setErrors((prev) => ({ ...prev, image: "" }));
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
    if (!addressLine1.trim()) newErrors.addressLine1 = "Required";
    if (!city.trim()) newErrors.city = "Required";
    if (!state) newErrors.state = "Required";
    if (!pincode.trim()) newErrors.pincode = "Required";
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
    if (!mobile.trim()) newErrors.mobile = "Required";
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Enter valid 10-digit mobile number";
    if (!totalCapacity) newErrors.totalCapacity = "Required";
    if (!capacityUnit) newErrors.capacityUnit = "Required";
    if (!aisle) newErrors.aisle = "Required";
    if (!rack) newErrors.rack = "Required";
    if (!level) newErrors.level = "Required";
    if (!maxUnits) newErrors.maxUnits = "Required";
    if (!imagePreview && !imageFile) newErrors.image = "Image required";

    if (Object.keys(newErrors).length > 0) {
      // setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      // formData.append("userId", userId);
      formData.append("code", code);
      // formData.append("type", type);
      // formData.append("status", status);
      formData.append("address", address);
      formData.append("addressLine1", addressLine1);
      formData.append("addressLine2", addressLine2);
      formData.append("city", city);
      formData.append("state", state?.value || "");
      formData.append("pincode", pincode);
      formData.append("mobile", mobile);
      formData.append("totalCapacity", totalCapacity);
      // formData.append("capacityUnit", capacityUnit);

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
      // setErrors((prev) => ({ ...prev, submit: "Failed to save warehouse." }));
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
                onChange={(e: any) => setName(e)}
              />
              {/* {errors.name && (
                <span className="create-warehouse-error">{errors.name}</span>
              )} */}
            </div>

            <div className="create-warehouse-row-split-dropdowns">
              {/* <div className="create-warehouse-field-group">
                <label>
                  Warehouse Code <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="e.g. WH-CHN-01"
                  value={code}
                  onChange={(e: any) => setCode(e)}
                />
                {errors.code && (
                  <span className="create-warehouse-error">{errors.code}</span>
                )}
              </div> */}
              <div className="create-warehouse-field-group">
                <label>
                  Warehouse Manager <span className="req">*</span>
                </label>
                <Dropdown
                  options={userOptions}
                  label={userId?.label || 'Select User'}
                  onSelect={(val: any) => setUserId(val)}
                  width="220px"
                />
                {/* {errors.userId && (
                  <span className="create-warehouse-error">{errors.userId}</span>
                )} */}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Ownership Type <span className="req">*</span>
                </label>
                <Dropdown
                  options={typeOptions}
                  label={type?.label || 'Select Owership Type'}
                  onSelect={(val: any) => setType(val)}
                  width="230px"
                />
                {/* {errors.type && (
                  <span className="create-warehouse-error">{errors.type}</span>
                )} */}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Operational Status <span className="req">*</span>
                </label>
                <Dropdown
                  options={statusOptions}
                  label={status?.label || 'Select Operational Status'}
                  onSelect={(val: any) => setStatus(val)}
                  width="250px"
                />
                {/* {errors.status && (
                  <span className="create-warehouse-error">
                    {errors.status}
                  </span>
                )} */}
              </div>

            </div>

          </div>
        </div>

        {/* Location & Capacity — expanded address */}
        <div className="create-warehouse-card">
          <div className="create-warehouse-card-header">
            <FiMapPin className="create-warehouse-header-icon" />
            <h2>Location & Capacity</h2>
          </div>

          <div className="create-warehouse-card-body">

            {/* Address Line 1 */}
            <div className="create-warehouse-field-group">
              <label>
                Address Line 1 <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="Flat, House no., Building, Company, Apart"
                value={addressLine1}
                onChange={(e: any) => setAddressLine1(e)}
              />
              {/* {errors.addressLine1 && (
                <span className="create-warehouse-error">{errors.addressLine1}</span>
              )} */}
            </div>

            {/* Address Line 2 */}
            <div className="create-warehouse-field-group">
              <label>Address Line 2</label>
              <DashBoardInput
                placeholder="Area, Street, Sector, Village"
                value={addressLine2}
                onChange={(e: any) => setAddressLine2(e)}
              />
            </div>

            {/* City, State, Pincode row */}
            <div className="create-warehouse-row-three">
              <div className="create-warehouse-field-group">
                <label>
                  City <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="Town / City"
                  value={city}
                  onChange={(e: any) => setCity(e)}
                />
                {/* {errors.city && (
                  <span className="create-warehouse-error">{errors.city}</span>
                )} */}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  State <span className="req">*</span>
                </label>
                <Dropdown
                  options={stateOptions}
                  label={state?.label || "State"}
                  onSelect={(val: any) => setState(val)}
                />
                {/* {errors.state && (
                  <span className="create-warehouse-error">{errors.state}</span>
                )} */}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Pincode <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="6-digit Pincode"
                  value={pincode}
                  onChange={(e: any) => setPincode(e)}
                  type="number"
                />
                {/* {errors.pincode && (
                  <span className="create-warehouse-error">{errors.pincode}</span>
                )} */}
              </div>
              <div className="create-warehouse-field-group">
                <label>
                  Mobile Number <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="10-digit Mobile Number"
                  value={mobile}
                  onChange={(e: any) => setMobile(e)}
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="create-warehouse-row-address">
              <div className="create-warehouse-row-split-address">
                <div className="create-warehouse-field-group">
                  <label>
                    Total Capacity <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    placeholder="0"
                    value={totalCapacity}
                    onChange={(e: any) => setTotalCapacity(e)}
                    type="number"
                  />
                  {/* {errors.totalCapacity && (
                    <span className="create-warehouse-error">
                      {errors.totalCapacity}
                    </span>
                  )} */}
                </div>
                <div className="create-warehouse-field-group">
                  <label>
                    Capacity Unit <span className="req">*</span>
                  </label>
                  <Dropdown
                    options={unitOptions}
                    label={capacityUnit?.label || 'Select Capacity Unit'}
                    onSelect={(val: any) => setCapacityUnit(val)}
                  />
                  {/* {errors.capacityUnit && (
                    <span className="create-warehouse-error">
                      {errors.capacityUnit}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="create-warehouse-card">
          <div className="create-warehouse-card-header">
            <FiLayers className="create-warehouse-header-icon" />
            <h2>Initial Bin Infrastructure</h2>
          </div>

          <div className="create-warehouse-card-body-bin">
            {/* <div className="create-warehouse-row-split-bin"> */}
            <div className="create-warehouse-field-group-bin">
              <label>
                Aisle <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="e.g. A01"
                value={aisle}
                onChange={(e: any) => setAisle(e)}
              />
              {/* {errors.aisle && (
                <span className="create-warehouse-error">{errors.aisle}</span>
              )} */}
            </div>
            <div className="create-warehouse-field-group-bin">
              <label>
                Rack <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="e.g. R02"
                value={rack}
                onChange={(e: any) => setRack(e)}
              />
              {/* {errors.rack && (
                <span className="create-warehouse-error">{errors.rack}</span>
              )} */}
            </div>
            <div className="create-warehouse-field-group-bin">
              <label>
                Level <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="e.g. L3"
                value={level}
                onChange={(e: any) => setLevel(e)}
              />
              {/* {errors.level && (
                <span className="create-warehouse-error">{errors.level}</span>
              )} */}
            </div>
            <div className="create-warehouse-field-group-bin">
              <label>
                Max Units (per Bin) <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="0"
                value={maxUnits}
                onChange={(e: any) => setMaxUnits(e)}
                type="number"
              />
              {/* {errors.maxUnits && (
                <span className="create-warehouse-error">
                  {errors.maxUnits}
                </span>
              )} */}
            </div>
            {/* </div> */}
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
              className={`create-warehouse-upload-area ${name ? "error-border" : ""}`} //TODO: check here
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
            {/* {errors.image && (
              <span className="create-warehouse-error">{errors.image}</span>
            )} */}
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