import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiUploadCloud, FiX } from "react-icons/fi";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditBrand.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Category } from "../../../entity/category";
import { Brand } from "../../../entity/brand/index";

const CreateOrEditBrand: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Image States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    category?: string;
    image?: string;
  }>({});
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [nameError, setNameError] = useState<string>(null);
  const [descriptionError, setDescriptionError] = useState<string>(null);
  const [imageFileError, setImageFileError] = useState<string>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Categories for Dropdown & Brand Data if Edit Mode
  useEffect(() => {
    // 1. Fetch categories for the dropdown
    axios
      .get("/api/categories")
      .then((res) => {
        // Assuming res.data is an array of Category objects
        const options = res.data.map((cat: Category) => ({
          label: cat.name || "Unnamed Category",
          value: cat.id || "",
        }));
        setCategoryOptions(options);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        // Fallback mock data for UI testing
        setCategoryOptions([
          { id: "1", label: "Nuts & Seeds", value: "cat_1" },
          { id: "2", label: "Dried Fruits", value: "cat_2" },
          { id: "3", label: "Organic Spices", value: "cat_3" },
        ]);
      });

    // 2. Fetch Brand if in Edit Mode
    if (isEditMode) {
      setIsLoading(true);
      // axios
      //   .get(`/api/brands/${id}`)
      //   .then((response.data) => {
      //     const brand: Brand = response.data;
      //     setName(brand.name || "");
      //     setDescription(brand.description || "");
      //     setImagePreview(brand.image || null);
      //     if (brand.category?.id) {
      //       setCategoryId(brand.category.id);
      //     }
      //   })
      //   .catch((error) => console.error("Error fetching brand:", error))
      //   .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 2MB",
        }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isValid = () => {
    if (!name.trim()) {
      setNameError("Please Provide Category Name");
    } else if (!description.trim()) {
      setDescriptionError("Please Provide Category Description");
    } else if (!imagePreview && !imageFile) {
      setImageFileError("Please Provide Category Image");
    } else {
      return true;
    }

    return false;
  };

  // Validation & Submit
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "This field is required";
    if (!description.trim()) newErrors.description = "This field is required";
    if (!categoryId) newErrors.category = "This field is required";
    if (!imagePreview && !imageFile) newErrors.image = "This field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      if (imageFile) formData.append("image", imageFile);

      if (isEditMode) {
        await axios.put(`/api/brands/${id}`, formData);
      } else {
        await axios.post("/api/brands", formData);
      }

      navigate("/dashboard/brands"); // Navigate back to brands list
    } catch (error) {
      console.error("Failed to save brand", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-brand-container">
      {/* Header */}
      <div className="create-brand-top-bar">
        <button
          className="create-brand-back-btn"
          onClick={() => navigate("/dashboard/brands")}
        >
          <FiArrowLeft /> Back to Brands
        </button>
        <h1 className="create-brand-title">
          {isEditMode ? "Edit Brand" : "Create New Brand"}
        </h1>
        <p className="create-brand-subtitle">
          Expand the collection by adding a new curated partner.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="create-brand-grid">
        {/* LEFT COLUMN: Form Details */}
        <div className="create-brand-left-col">
          <div className="create-brand-form-card">
            <div className="create-brand-row-split">
              <div className="create-brand-field-group">
                <label className="create-brand-label">Brand Name</label>
                <DashBoardInput
                  placeholder="Enter brand name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="create-brand-error-text">! {errors.name}</p>
                )}
              </div>

              <div className="create-brand-field-group">
                <label className="create-brand-label">Select Category</label>
                <Dropdown
                  options={categoryOptions}
                  label={categoryId ? categoryId : "Choose a Category"}
                  onSelect={(val: any) => setCategoryId(val)}
                  //   placeholder="Choose a category"
                  width="250px"
                />
                {errors.category && (
                  <p className="create-brand-error-text">! {errors.category}</p>
                )}
              </div>
            </div>

            <div className="create-brand-field-group">
              <label className="create-brand-label">Description</label>
              <textarea
                className={`create-brand-textarea ${errors.description ? "error-border" : ""}`}
                placeholder="Enter a brief brand description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
              {errors.description && (
                <p className="create-brand-error-text">
                  ! {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons aligned left under the form */}
          <div className="create-brand-actions">
            <DashBoardButton
              icon={<FiX size={25} />}
              name="Cancel"
              variant="secondary"
              onClick={() => navigate("/dashboard/brands")}
            />
            <DashBoardButton
              icon={<IoMdAddCircleOutline size={25} />}
              name={isEditMode ? "Save Changes" : "Create Brand"}
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Image Upload */}
        <div className="create-brand-right-col">
          <div className="create-brand-field-group">
            <label className="create-brand-label">Brand Image</label>

            <div
              className={`create-brand-image-upload-box ${errors.image ? "error-border" : ""}`}
            >
              {imagePreview ? (
                <div className="create-brand-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Brand Preview"
                    className="create-brand-preview-img"
                  />
                  <button
                    className="create-brand-remove-image-btn"
                    onClick={removeImage}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div
                  className="create-brand-upload-prompt"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="create-brand-icon-wrapper">
                    <FiUploadCloud className="create-brand-upload-icon" />
                  </div>
                  <p className="create-brand-upload-text">
                    Click to upload or drag and drop
                  </p>
                  <p className="create-brand-upload-subtext">
                    (Max size 2MB, JPG, PNG)
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
              />
            </div>
            {errors.image && (
              <p className="create-brand-error-text">! {errors.image}</p>
            )}
          </div>

          {/* Aesthetic Preview Placeholder (Matches Screenshot) */}
          {/* <div className="create-brand-aesthetic-preview">
            <label className="create-brand-label">AESTHETIC PREVIEW</label>
            <div className="create-brand-aesthetic-box">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Aesthetic"
                  className="create-brand-preview-img"
                />
              ) : (
                <div className="create-brand-placeholder-img"></div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CreateOrEditBrand;
