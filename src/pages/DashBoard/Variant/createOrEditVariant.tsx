import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiX,
  FiBox,
  FiImage,
} from "react-icons/fi";

import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditVariant.css";
import { Variant, VariantGrade, VariantType } from "../../../entity/variant";

const CreateOrEditVariant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Core Form States
  const [name, setName] = useState("");
  const [productId, setProductId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [type, setType] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [grade, setGrade] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);

  // Inventory & Pricing States
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  // Image States (Max 6)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [productOptions, setProductOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown Configurations
  const typeOptions = [
    { id: "1", label: "Full", value: VariantType.FULL },
    { id: "2", label: "Broke", value: VariantType.BROKE },
    { id: "3", label: "Spare", value: VariantType.SPARE },
  ];

  const gradeOptions = [
    { id: "1", label: "Grade 1", value: VariantGrade.GRADE1 },
    { id: "2", label: "Grade 2", value: VariantGrade.GRADE2 },
  ];

  // Fetch Data on Load
  useEffect(() => {
    // Fetch Products for the Dropdown
    axios
      .get("/api/products")
      .then((res) => {
        setProductOptions(
          res.data.map((p: any) => ({ label: p.name || p.title, value: p.id })),
        );
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        // Fallback for UI testing
        setProductOptions([
          { id: "", label: "Premium Medjool Dates", value: "prod_1" },
          { id: "", label: "Organic Cashews", value: "prod_2" },
        ]);
      });

    // Fetch Variant if in Edit Mode
    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`/api/variants/${id}`)
        .then((res) => {
          const variant: Variant = res.data;
          setName(variant.name || "");
          setProductId({
            id: variant.product?.id,
            label: variant.product?.name,
            value: variant.product?.name,
          });
          setType({
            id: variant.type,
            label: variant.type,
            value: variant.type,
          });
          setGrade({
            id: variant.grade,
            label: variant.grade,
            value: variant.grade,
          });
          setPrice(variant.price?.toString() || "");
          setSku(variant.sku || "");
          setStockQuantity(variant.stockQuantity?.toString() || "");
          setExistingImages(variant.images || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  // Image Handling Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentTotal = existingImages.length + newImageFiles.length;

      if (currentTotal + files.length > 6) {
        setErrors((prev) => ({ ...prev, images: "Maximum 6 images allowed." }));
        return;
      }

      const validFiles = files.filter((f) => f.size <= 5 * 1024 * 1024); // 5MB limit
      if (validFiles.length < files.length) {
        setErrors((prev) => ({
          ...prev,
          images: "Some files exceeded the 5MB limit and were removed.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, images: "" }));
      }

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setNewImageFiles((prev) => [...prev, ...validFiles]);
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Required";
    if (!productId) newErrors.productId = "Required";
    if (!type) newErrors.type = "Required";
    if (!grade) newErrors.grade = "Required";
    if (!price) newErrors.price = "Required";
    if (!sku.trim()) newErrors.sku = "Required";
    if (!stockQuantity) newErrors.stockQuantity = "Required";
    if (existingImages.length === 0 && newImageFiles.length === 0)
      newErrors.images = "At least one image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      //   const formData = new FormData();
      //   formData.append("name", name);
      //   formData.append("productId", productId);
      //   formData.append("type", type);
      //   formData.append("grade", grade);
      //   formData.append("price", price);
      //   formData.append("sku", sku);
      //   formData.append("stockQuantity", stockQuantity);

      //   formData.append("existingImages", JSON.stringify(existingImages));

      //   newImageFiles.forEach((file) => {
      //     formData.append("images", file);
      //   });

      //   if (isEditMode) {
      //     await axios.put(`/api/variants/${id}`, formData);
      //   } else {
      //     await axios.post("/api/variants", formData);
      //   }

      navigate("/dashboard/products"); // Redirect to products
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, submit: "Failed to save variant." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-variant-container">
      {/* Header */}
      <div className="create-variant-header-wrapper">
        <div className="create-variant-title-area">
          <button
            className="create-variant-back-btn"
            onClick={() => navigate("/dashboard/products")}
          >
            <FiArrowLeft /> Back to Products
          </button>
          <h1 className="create-variant-title">
            {isEditMode ? "Edit Variant" : "Add Variant"}
          </h1>
          <p className="create-variant-subtitle">
            Define new SKU specifications for the organic catalog.
          </p>
        </div>
      </div>

      <div className="create-variant-sections-wrapper">
        {/* Section 1: Core Details */}
        <div className="create-variant-card">
          <div className="create-variant-card-header">
            <FiBox className="create-variant-header-icon" />
            <h2>Variant Specifications</h2>
          </div>

          <div className="create-variant-card-body">
            <div className="create-variant-field-group">
              <label>
                Variant Name <span className="req">*</span>
              </label>
              <DashBoardInput
                placeholder="e.g. 500g Glass Jar"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
              {errors.name && (
                <span className="create-variant-error">{errors.name}</span>
              )}
            </div>

            <div className="create-variant-field-group">
              <label>
                Select Product <span className="req">*</span>
              </label>
              <Dropdown
                width="250px"
                options={productOptions}
                onSelect={(val: any) => setProductId(val)}
                label={productId?.label ? productId.label : "Select Product"}
              />
              {errors.productId && (
                <span className="create-variant-error">{errors.productId}</span>
              )}
            </div>

            <div className="create-variant-row-split">
              <div className="create-variant-field-group">
                <label>
                  Type <span className="req">*</span>
                </label>
                <Dropdown
                  width="250px"
                  options={typeOptions}
                  onSelect={(val: any) => setType(val)}
                  label={type?.label ? type?.label : "Select Type"}
                />
                {errors.type && (
                  <span className="create-variant-error">{errors.type}</span>
                )}
              </div>
              <div className="create-variant-field-group">
                <label>
                  Grade <span className="req">*</span>
                </label>
                <Dropdown
                  width="250px"
                  options={gradeOptions}
                  onSelect={(val: any) => setGrade(val)}
                  label={grade?.label ? grade.label : "Select Grade"}
                />
                {errors.grade && (
                  <span className="create-variant-error">{errors.grade}</span>
                )}
              </div>
            </div>

            <div className="create-variant-row-split">
              <div className="create-variant-field-group">
                <label>
                  Price (₹) <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="0.00"
                  value={price}
                  onChange={(e: any) => setPrice(e.target.value)}
                  type="number"
                />
                {errors.price && (
                  <span className="create-variant-error">{errors.price}</span>
                )}
              </div>
            </div>

            <div className="create-variant-row-split">
              <div className="create-variant-field-group">
                <label>
                  SKU <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="e.g. MED-500G-GR1"
                  value={sku}
                  onChange={(e: any) => setSku(e.target.value)}
                />
                {errors.sku && (
                  <span className="create-variant-error">{errors.sku}</span>
                )}
              </div>
              <div className="create-variant-field-group">
                <label>
                  Stock Quantity <span className="req">*</span>
                </label>
                <DashBoardInput
                  placeholder="0"
                  value={stockQuantity}
                  onChange={(e: any) => setStockQuantity(e.target.value)}
                  type="number"
                />
                {errors.stockQuantity && (
                  <span className="create-variant-error">
                    {errors.stockQuantity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Variant Images */}
        <div className="create-variant-card">
          <div className="create-variant-card-header">
            <FiImage className="create-variant-header-icon" />
            <div className="create-variant-header-text">
              <h2>Variant Images</h2>
              <span className="create-variant-meta-text">MAX 6 FILES</span>
            </div>
          </div>

          <div className="create-variant-card-body">
            {/* Upload Area */}
            {existingImages.length + newImageFiles.length < 6 && (
              <div
                className={`create-variant-upload-area ${errors.images ? "error-border" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="create-variant-upload-icon-wrapper">
                  <FiUploadCloud className="create-variant-upload-icon" />
                </div>
                <span className="create-variant-upload-title">
                  Click to upload or drag and drop
                </span>
                <span className="create-variant-upload-subtitle">
                  PNG, JPG or WebP up to 5MB
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />
              </div>
            )}
            {errors.images && (
              <span
                className="create-variant-error"
                style={{ marginTop: "10px" }}
              >
                {errors.images}
              </span>
            )}

            {/* Image Previews Gallery */}
            <div className="create-variant-media-gallery">
              {existingImages.map((url, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="create-variant-preview-box"
                >
                  <img src={url} alt={`Existing ${idx}`} />
                  <button
                    className="create-variant-remove-img"
                    onClick={() => removeExistingImage(idx)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {newImagePreviews.map((url, idx) => (
                <div key={`new-${idx}`} className="create-variant-preview-box">
                  <img src={url} alt={`Preview ${idx}`} />
                  <button
                    className="create-variant-remove-img"
                    onClick={() => removeNewImage(idx)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {/* Empty state placeholders to mimic the UI reference */}
              {Array.from({
                length: Math.max(
                  0,
                  4 - (existingImages.length + newImageFiles.length),
                ),
              }).map((_, idx) => (
                <div key={`empty-${idx}`} className="create-variant-empty-box">
                  <FiImage />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="create-variant-footer">
        <DashBoardButton
          name="Cancel"
          variant="secondary"
          onClick={() => navigate("/dashboard/products")}
        />
        <DashBoardButton
          name={isEditMode ? "Save Changes" : "Create Variant"}
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateOrEditVariant;
