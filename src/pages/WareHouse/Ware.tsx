// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiArrowLeft,
//   FiX,
//   FiUploadCloud,
//   FiBox,
//   FiMapPin,
//   FiLayers,
// } from "react-icons/fi";

// import DashBoardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
// import DashBoardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
// import Dropdown from "../../assets/dropdown/DropDown";
// import "./Ware.css";
// import { ProfileService } from "../../service/profile";
// import { Address, AddressType } from "../../entity/address";
// import {
//   CapacityUnit,
//   Warehouse,
//   WarehouseBin,
//   WarehouseStatus,
//   WarehouseType,
// } from "../../entity/warehouse";
// import { INDIAN_STATES } from "../../utils/utils";
// import { Profile } from "../../entity/profile";
// import { User } from "../../entity/user";

// const typeOptions = [
//   {
//     id: WarehouseType.OWN,
//     label: WarehouseType.OWN,
//     value: WarehouseType.OWN,
//   },
//   {
//     id: WarehouseType.RENTED,
//     label: WarehouseType.RENTED,
//     value: WarehouseType.RENTED,
//   },
// ];
// const statusOptions = [
//   {
//     id: WarehouseStatus.ACTIVE,
//     label: WarehouseStatus.ACTIVE,
//     value: WarehouseStatus.ACTIVE,
//   },
//   {
//     id: WarehouseStatus.INACTIVE,
//     label: WarehouseStatus.INACTIVE,
//     value: WarehouseStatus.INACTIVE,
//   },
//   {
//     id: WarehouseStatus.MAINTENANCE,
//     label: WarehouseStatus.MAINTENANCE,
//     value: WarehouseStatus.MAINTENANCE,
//   },
// ];
// const unitOptions = [{ id: "", label: "Units", value: CapacityUnit.UNITS }];

// const Ware: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   // General States
//   const [name, setName] = useState<string>("");
//   const [userId, setUserId] = useState<{
//     id: string;
//     label: string;
//     value: string;
//   }>({ id: "1", label: "tester", value: "tester" }); // The user select field mentioned
//   const [type, setType] = useState<{
//     id: WarehouseType;
//     label: WarehouseType;
//     value: WarehouseType;
//   }>(null);
//   const [status, setStatus] = useState<{
//     id: WarehouseStatus;
//     label: WarehouseStatus;
//     value: WarehouseStatus;
//   }>(null);

//   // Expanded Address States
//   const [addressLine1, setAddressLine1] = useState<string>("");
//   const [addressLine2, setAddressLine2] = useState<string>("");

//   const [nameError, setNameError] = useState<string>(null);
//   const [userIdError, setUserIdError] = useState<string>(null);
//   const [typeError, setTypeError] = useState<string>(null);
//   const [statusError, setStatusError] = useState<string>(null);
//   const [addressLine1Error, setAddressLine1Error] = useState<string>("");
//   const [addressLine2Error, setAddressLine2Error] = useState<string>("");
//   const [cityError, setCityError] = useState<string>(null);
//   const [stateError, setStateError] = useState<string>(null);
//   const [pincodeError, setPincodeError] = useState<string>(null);
//   const [mobileError, setMobileError] = useState<string>(null);
//   const [totalCapacityError, setTotalCapacityError] = useState<string>(null);
//   const [capacityUnitError, setCapacityUnitError] = useState<string>(null);
//   const [imagePreviewError, setImagePreviewError] = useState<string>(null);
//   const [aisleError, setAisleError] = useState<string>(null);
//   const [rackError, setRackError] = useState<string>(null);
//   const [levelError, setLevelError] = useState<string>(null);
//   const [maxUnitsError, setMaxUnitsError] = useState<string>(null);

//   const [city, setCity] = useState<string>("");
//   const [state, setState] = useState<{
//     id: string;
//     label: string;
//     value: string;
//   }>(null);
//   const [pincode, setPincode] = useState<string>("");
//   const [mobile, setMobile] = useState<string>("");

//   // Capacity States
//   const [totalCapacity, setTotalCapacity] = useState("");
//   const [capacityUnit, setCapacityUnit] = useState<{
//     id: CapacityUnit;
//     label: CapacityUnit;
//     value: CapacityUnit;
//   }>(null);

//   // Initial Bin / Layout States
//   const [aisle, setAisle] = useState<string>("");
//   const [rack, setRack] = useState<string>("");
//   const [level, setLevel] = useState<string>("");
//   const [maxUnits, setMaxUnits] = useState<string>("");

//   // Image States
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // UI States
//   const [isLoading, setIsLoading] = useState(false);

//   // Dropdown Options
//   const [userOptions, setUserOptions] = useState<
//     { id: string; label: string; value: string }[]
//   >([]);

//   // State dropdown options derived from INDIAN_STATES
//   const stateOptions = INDIAN_STATES.map((s: string) => ({
//     id: s,
//     label: s,
//     value: s,
//   }));

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     (async () => {
//       setIsLoading(true);
//       try {
//         let profiles = await new ProfileService().get();
//         setUserOptions(
//           profiles.map((profile: Profile) => ({
//             id: profile.id,
//             label: profile.name,
//             value: profile.name,
//           })),
//         );
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     // Fetch users for the manager/user select dropdown
//     (async () => {

//       if (isEditMode) {
//         setIsLoading(true);
//         let warehouseResponse = await axios.get('/api/warehouses') as Warehouse;
//         let warehouseBinResponse = await axios.get(`/api/warehousebins/${id}/warehouse`);

//         setAddressLine1(warehouseResponse.address.line1);
//         setAddressLine2(warehouseResponse.address.line2);
//         setCity(warehouseResponse.address.city);
//         setState({ id: warehouseResponse.address.state, label: warehouseResponse.address.state, value: warehouseResponse.address.state });
//         setMobile(warehouseResponse.address.mobile);

//         setName(warehouseResponse.name);
//         setType({ id: warehouseResponse.type, label: warehouseResponse.type, value: warehouseResponse.type });
//         setUserId({ id: warehouseResponse.operator.id, label: warehouseResponse.operator.id, value: warehouseResponse.operator.id });
//         setStatus({id: warehouseResponse.status, label: warehouseResponse.status, value: warehouseResponse.status});
//         setTotalCapacity(warehouseResponse.totalCapacity?.toString());
//         setCapacityUnit({id: warehouseResponse.capacityUnit, label: warehouseResponse.capacityUnit, value: warehouseResponse.capacityUnit});
//         // setImagePreview();

//         // TODO: need to prefill warehouse bin deat 
//       }
//     })()
//   }, [id, isEditMode]);

//   // Image Handling
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > 2 * 1024 * 1024) {
//         setImagePreviewError("File size must be less than 2MB");
//         return;
//       }
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setImagePreviewError(null);
//     }
//   };

//   const removeImage = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setImageFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const isValid = () => {
//     if (!name) {
//       setNameError('This is required');
//     } else if (!userId) {
//       setUserIdError('This is required');
//     } else if (!type) {
//       setTypeError('This is required');
//     } else if (!status) {
//       setStatusError('This is required');
//     } else if (!addressLine1) {
//       setAddressLine1('This is required');
//     } else if (!addressLine2) {
//       setAddressLine2('This is required');
//     } else if (!city) {
//       setCityError('This is required');
//     } else if (!state) {
//       setStateError('This is required');
//     } else if (!pincode) {
//       setPincodeError('This is required');
//     } else if (!mobile) {
//       setMobileError('This is required');
//     } else if (!totalCapacity) {
//       setTotalCapacityError('This is required');
//     } else if (!capacityUnit) {
//       setCapacityUnitError('This is required');
//     } else if (!aisle) {
//       setAisleError('This is required');
//     } else if (!rack) {
//       setRackError('This is required');
//     } else if (!level) {
//       setLevelError('This is required');
//     } else if (!maxUnits) {
//       setMaxUnitsError('This is required');
//     } else if (!imagePreview) {
//       setImagePreviewError('Please Provide an Image')
//     } else {
//       return true;
//     }
//     return false;
//   }

//   // Submission
//   const handleSubmit = async () => {

//     // else if (!/^\d{6}$/.test(pincode))
//     // else if (!/^\d{10}$/.test(mobile))
//     if (isValid()) {
//       setIsLoading(true);

//       try {

//         let addressData = new Address();
//         addressData.line1 = addressLine1;
//         addressData.line2 = addressLine2;
//         addressData.city = city;
//         addressData.state = state.label;
//         addressData.country = 'USA'; // by default now its USA 
//         addressData.type = AddressType.OFFICE; // bu default now its Office
//         addressData.mobile = mobile;

//         let warehouse = new Warehouse();
//         warehouse.address = addressData;

//         let operator = new User();
//         operator.id = userId.value;
//         warehouse.operator = operator;

//         warehouse.name = name;
        
//         warehouse.type = type.value;
        
//         warehouse.status = status.value;

//         warehouse.totalCapacity = Number(totalCapacity);

//         warehouse.capacityUnit = capacityUnit.value;

//         warehouse.image = imagePreview;

//         let warehouseBin = new WarehouseBin();
//         warehouseBin.aisle = aisle;
//         warehouseBin.rack = rack;
//         warehouseBin.level = level;
//         warehouseBin.maxUnits = Number(maxUnits);

//         if (isEditMode) {
//           let warehouseResponse = await axios.put(`/api/warehouses/${id}`, warehouse);
//           if (warehouseResponse) {
//             await axios.put(`/api/warehousebins/${id}`, warehouseBin);
//           }
//         } else {
//           let warehouseResponse = await axios.post("/api/warehouses", warehouse);
//           if (warehouseResponse) {
//             await axios.post("/api/warehousebins", warehouseBin);
//           }
//         }
//         navigate("/dashboard/warehouses");
//         setIsLoading(false);
//       } catch (err) {
//         console.error(err);
//         setIsLoading(false);
//       }
//     }
//   };

//   const onChangeName = (name: string) => {
//     if (name?.length > 60) {
//       setNameError("Only 60 characters allowed");
//     } else {
//       // add any regexs
//       setName(name);
//       setNameError(null);
//     }
//   };

//   const onChangeAddressLine1 = (addressLine1: string) => {
//     if (addressLine1?.length > 60) {
//       setAddressLine1Error("Only 60 characters allowed");
//     } else {
//       // add any regexs
//       setAddressLine1(addressLine1);
//       setAddressLine1Error(null);
//     }
//   };

//   const onChangeAddressLine2 = (addressLine2: string) => {
//     if (addressLine2?.length > 60) {
//       setAddressLine2Error("Only 60 characters allowed");
//     } else {
//       // add any regexs
//       setAddressLine2(addressLine2);
//       setAddressLine2Error(null);
//     }
//   };

//   const onChangeCity = (city: string) => {
//     if (city?.length > 30) {
//       setCityError("Only 30 characters allowed");
//     } else {
//       // add any regexs
//       setCity(city);
//       setCityError(null);
//     }
//   };

//   const onChangePincode = (pincode: string) => {
//     if (pincode?.length > 6) {
//       setPincodeError("Only 6 characters allowed");
//     } else {
//       // add any regexs
//       setPincode(pincode);
//       setPincodeError(null);
//     }
//   };

//   const onChangeMobile = (mobile: string) => {
//     if (mobile?.length > 10) {
//       setMobileError("Only 10 characters allowed");
//     } else {
//       // add any regexs
//       setMobile(mobile);
//       setMobileError(null);
//     }
//   };

//   const onChangeTotalCapacity = (totalCapacity: string) => {
//     if (totalCapacity) {
//       setTotalCapacityError("Please Provide Total Capacity Details");
//     } else {
//       // add any regexs
//       setTotalCapacity(totalCapacity);
//       setTotalCapacityError(null);
//     }
//   };

//   const onChangeAisle = (aisle: string) => {
//     if (aisle) {
//       setAisleError("Please Provide Asile Details");
//     } else {
//       // add any regexs
//       setAisle(aisle);
//       setAisleError(null);
//     }
//   };

//   const onChangeRack = (rack: string) => {
//     if (rack) {
//       setRackError("Please Provide Rack Details");
//     } else {
//       // add any regexs
//       setRack(rack);
//       setRackError(null);
//     }
//   };

//   const onChangeLevel = (level: string) => {
//     if (level) {
//       setLevelError("Please Provide Level Details");
//     } else {
//       // add any regexs
//       setLevel(level);
//       setLevelError(null);
//     }
//   };

//   const onChangeMaxUnits = (maxUnits: string) => {
//     if (maxUnits) {
//       setMaxUnitsError("Please Provide Max Units Details");
//     } else {
//       // add any regexs
//       setMaxUnits(maxUnits);
//       setMaxUnitsError(null);
//     }
//   };

//   const onChangeUserId = (userId: {
//     id: string;
//     label: string;
//     value: string;
//   }) => {
//     if (userId) {
//       setUserIdError("Please Select Manager");
//     } else {
//       // add any regexs
//       setUserId(userId);
//       setUserIdError(null);
//     }
//   };

//   const onChangeType = (type: {
//     id: WarehouseType;
//     label: WarehouseType;
//     value: WarehouseType;
//   }) => {
//     if (type) {
//       setTypeError("Please Select Type");
//     } else {
//       // add any regexs
//       setType(type);
//       setTypeError(null);
//     }
//   };

//   const onChangeStatus = (status: {
//     id: WarehouseStatus;
//     label: WarehouseStatus;
//     value: WarehouseStatus;
//   }) => {
//     if (status) {
//       setStatusError("Please Select Status");
//     } else {
//       // add any regexs
//       setStatus(status);
//       setStatusError(null);
//     }
//   };

//   const onChangeState = (state: {
//     id: string;
//     label: string;
//     value: string;
//   }) => {
//     if (state) {
//       setStateError("Please Select State");
//     } else {
//       // add any regexs
//       setState(state);
//       setStateError(null);
//     }
//   };

//   const onChangeCapacityUnit = (capacityUnit: {
//     id: CapacityUnit;
//     label: CapacityUnit;
//     value: CapacityUnit;
//   }) => {
//     if (capacityUnit) {
//       setCapacityUnitError("Please Select Capacity Unit");
//     } else {
//       // add any regexs
//       setCapacityUnit(capacityUnit);
//       setCapacityUnitError(null);
//     }
//   };

//   return (
//     <div className="create-warehouse-container">
//       {/* Header */}
//       <div className="create-warehouse-header-wrapper">
//         <div className="create-warehouse-title-area">
//           <button
//             className="create-warehouse-back-btn"
//             onClick={() => navigate("/dashboard/warehouses")}
//           >
//             <FiArrowLeft /> Back to Warehouses
//           </button>
//           <h1 className="create-warehouse-title">
//             {isEditMode ? "Edit Warehouse" : "Add New Warehouse"}
//           </h1>
//           <p className="create-warehouse-subtitle">
//             Configure storage locations and initial bin infrastructure.
//           </p>
//         </div>
//       </div>

//       <div className="create-warehouse-sections-wrapper">
//         <div className="create-warehouse-card">
//           <div className="create-warehouse-card-header">
//             <FiBox className="create-warehouse-header-icon" />
//             <h2>Warehouse Details</h2>
//           </div>

//           <div className="create-warehouse-card-body">
//             <div className="create-warehouse-field-group">
//               <label>
//                 Warehouse Name <span className="req">*</span>
//               </label>
//               <DashBoardInput
//                 placeholder="e.g. Central Hub Chennai"
//                 value={name}
//                 onChange={(e: any) => onChangeName(e)}
//                 error={nameError ? true : false}
//                 errorMessage={nameError}
//               />
//             </div>

//             <div className="create-warehouse-row-split-dropdowns">
//               {/* <div className="create-warehouse-field-group">
//                 <label>
//                   Warehouse Code <span className="req">*</span>
//                 </label>
//                 <DashBoardInput
//                   placeholder="e.g. WH-CHN-01"
//                   value={code}
//                   onChange={(e: any) => setCode(e)}
//                 />
//                 {errors.code && (
//                   <span className="create-warehouse-error">{errors.code}</span>
//                 )}
//               </div> */}
//               <div className="create-warehouse-field-group">
//                 <label>
//                   Warehouse Manager <span className="req">*</span>
//                 </label>
//                 <Dropdown
//                   options={userOptions}
//                   label={userId?.label || "Select User"}
//                   onSelect={(val: any) => onChangeUserId(val)}
//                   width="220px"
//                   error={userIdError ? true : false}
//                   errorMessage={userIdError}
//                 />
//               </div>
//               <div className="create-warehouse-field-group">
//                 <label>
//                   Ownership Type <span className="req">*</span>
//                 </label>
//                 <Dropdown
//                   options={typeOptions}
//                   label={type?.label || "Select Owership Type"}
//                   onSelect={(val: any) => onChangeType(val)}
//                   width="230px"
//                   error={typeError ? true : false}
//                   errorMessage={typeError}
//                 />
//               </div>
//               <div className="create-warehouse-field-group">
//                 <label>
//                   Operational Status <span className="req">*</span>
//                 </label>
//                 <Dropdown
//                   options={statusOptions}
//                   label={status?.label || "Select Operational Status"}
//                   onSelect={(val: any) => onChangeStatus(val)}
//                   width="250px"
//                   error={statusError ? true : false}
//                   errorMessage={statusError}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="create-warehouse-card">
//           <div className="create-warehouse-card-header">
//             <FiMapPin className="create-warehouse-header-icon" />
//             <h2>Location & Capacity</h2>
//           </div>

//           <div className="create-warehouse-card-body">
//             <div className="create-warehouse-field-group">
//               <label>
//                 Address Line 1 <span className="req">*</span>
//               </label>
//               <DashBoardInput
//                 placeholder="Flat, House no., Building, Company, Apart"
//                 value={addressLine1}
//                 onChange={(e: any) => onChangeAddressLine1(e)}
//                 error={addressLine1Error ? true : false}
//                 errorMessage={addressLine1Error}
//               />

//               <div className="create-warehouse-field-group">
//                 <label>Address Line 2</label>
//                 <DashBoardInput
//                   placeholder="Area, Street, Sector, Village"
//                   value={addressLine2}
//                   onChange={(e: any) => onChangeAddressLine2(e)}
//                   error={addressLine2Error ? true : false}
//                   errorMessage={addressLine2Error}
//                 />
//               </div>

//               <div className="create-warehouse-row-three">
//                 <div className="create-warehouse-field-group">
//                   <label>
//                     City <span className="req">*</span>
//                   </label>
//                   <DashBoardInput
//                     placeholder="Town / City"
//                     value={city}
//                     onChange={(e: any) => onChangeCity(e)}
//                     error={cityError ? true : false}
//                     errorMessage={cityError}
//                   />
//                 </div>
//                 <div className="create-warehouse-field-group">
//                   <label>
//                     State <span className="req">*</span>
//                   </label>
//                   <Dropdown
//                     options={stateOptions}
//                     label={state?.label || "Select State"}
//                     onSelect={(val: any) => onChangeState(val)}
//                     error={stateError ? true : false}
//                     errorMessage={stateError}
//                   />
//                 </div>
//                 <div className="create-warehouse-field-group">
//                   <label>
//                     Pincode <span className="req">*</span>
//                   </label>
//                   <DashBoardInput
//                     placeholder="6-digit Pincode"
//                     value={pincode}
//                     onChange={(e: any) => onChangePincode(e)}
//                     type="number"
//                     error={pincodeError ? true : false}
//                     errorMessage={pincodeError}
//                   />
//                 </div>
//                 <div className="create-warehouse-field-group">
//                   <label>
//                     Mobile Number <span className="req">*</span>
//                   </label>
//                   <DashBoardInput
//                     placeholder="10-digit Mobile Number"
//                     value={mobile}
//                     onChange={(e: any) => onChangeMobile(e)}
//                     error={mobileError ? true : false}
//                     errorMessage={mobileError}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="create-warehouse-row-address">
//               <div className="create-warehouse-row-split-address">
//                 <div className="create-warehouse-field-group">
//                   <label>
//                     Total Capacity <span className="req">*</span>
//                   </label>
//                   <DashBoardInput
//                     placeholder="0"
//                     value={totalCapacity}
//                     onChange={(e: any) => onChangeTotalCapacity(e)}
//                     type="number"
//                     error={totalCapacityError ? true : false}
//                     errorMessage={totalCapacityError}
//                   />
//                 </div>
//                 <div className="create-warehouse-field-group">
//                   <label>
//                     Capacity Unit <span className="req">*</span>
//                   </label>
//                   <Dropdown
//                     options={unitOptions}
//                     label={capacityUnit?.label || "Select Capacity Unit"}
//                     onSelect={(val: any) => onChangeCapacityUnit(val)}
//                     error={capacityUnitError ? true : false}
//                     errorMessage={capacityUnitError}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="create-warehouse-card">
//           <div className="create-warehouse-card-header">
//             <FiLayers className="create-warehouse-header-icon" />
//             <h2>Initial Bin Infrastructure</h2>
//           </div>

//           <div className="create-warehouse-card-body-bin">
//             <div className="create-warehouse-field-group-bin">
//               <label>
//                 Aisle <span className="req">*</span>
//               </label>
//               <DashBoardInput
//                 placeholder="e.g. A01"
//                 value={aisle}
//                 onChange={(e: any) => onChangeAisle(e)}
//                 error={aisleError ? true : false}
//                 errorMessage={aisleError}
//               />
//             </div>
//             <div className="create-warehouse-field-group-bin">
//               <label>
//                 Rack <span className="req">*</span>
//               </label>
//               <DashBoardInput
//                 placeholder="e.g. R02"
//                 value={rack}
//                 onChange={(e: any) => onChangeRack(e)}
//                 error={rackError ? true : false}
//                 errorMessage={rackError}
//               />
//             </div>
//             <div className="create-warehouse-field-group-bin">
//               <label>
//                 Level <span className="req">*</span>
//               </label>
//               <DashBoardInput
//                 placeholder="e.g. L3"
//                 value={level}
//                 onChange={(e: any) => onChangeLevel(e)}
//                 error={levelError ? true : false}
//                 errorMessage={levelError}
//               />
//             </div>
//             <div className="create-warehouse-field-group-bin">
//               <label>
//                 Max Units (per Bin) <span className="req">*</span>
//               </label>
//               <DashBoardInput
//                 placeholder="0"
//                 value={maxUnits}
//                 onChange={(e: any) => onChangeMaxUnits(e)}
//                 error={maxUnitsError ? true : false}
//                 errorMessage={maxUnitsError}
//                 type="number"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Section 4: Facility Image */}
//         <div className="create-warehouse-card">
//           <div className="create-warehouse-card-header">
//             <FiUploadCloud className="create-warehouse-header-icon" />
//             <h2>Facility Image</h2>
//           </div>

//           <div className="create-warehouse-card-body">
//             <div
//               className={`create-warehouse-upload-area ${imagePreviewError ? "error-border" : ""}`}
//               onClick={() => fileInputRef.current?.click()}
//             >
//               {imagePreview ? (
//                 <div className="create-warehouse-preview-wrapper">
//                   <img src={imagePreview} alt="Facility Preview" />
//                   <button
//                     className="create-warehouse-remove-img"
//                     onClick={removeImage}
//                   >
//                     <FiX />
//                   </button>
//                 </div>
//               ) : (
//                 <div className="create-warehouse-upload-placeholder">
//                   <div className="create-warehouse-upload-icon-wrapper">
//                     <FiUploadCloud className="create-warehouse-upload-icon" />
//                   </div>
//                   <span className="create-warehouse-upload-title">
//                     Click to upload warehouse photo
//                   </span>
//                   <span className="create-warehouse-upload-subtitle">
//                     JPG or PNG up to 2MB
//                   </span>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 style={{ display: "none" }}
//               />
//             </div>
//             {imagePreviewError && (
//               <span className="create-warehouse-error">
//                 {imagePreviewError}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer Actions */}
//       <div className="create-warehouse-footer">
//         <DashBoardButton
//           name="Cancel"
//           variant="secondary"
//           onClick={() => navigate("/dashboard/warehouses")}
//         />
//         <DashBoardButton
//           name={isEditMode ? "Save Changes" : "Create Warehouse"}
//           variant="primary"
//           onClick={handleSubmit}
//           disabled={isLoading}
//         />
//       </div>
//     </div>
//   );
// };

// export default Ware;
