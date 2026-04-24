import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiUploadCloud, FiX } from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";

// Assuming these are the paths to your reusable components
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditCategory.css";
import { IoMdAddCircleOutline } from "react-icons/io";

// The entity structure provided
export class Category {
  id?: string;
  name?: string;
  description?: string;
  subCategory?: Category; // Used here as Parent Category reference
  image?: string;
}

const CreateOrEditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");

  // Image States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
  }>({});

  // Mock Categories for the Dropdown
  const [parentOptions, setParentOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Category if in Edit Mode
  useEffect(() => {
    // Fetch parent categories for dropdown (Mock example)
    // axios.get('/api/categories').then(res => format options...)
    setParentOptions([
      { id: "1", label: "Nuts & Seeds", value: "cat_1" },
      { id: "2", label: "Dried Fruits", value: "cat_2" },
      { id: "3", label: "Gift Boxes", value: "cat_3" },
    ]);

    if (isEditMode) {
      setIsLoading(true);
      // Replace with your actual API endpoint
      axios
        .get(`/api/categories/${id}`)
        .then((response) => {
          const category: Category = response.data;
          setName(category.name || "");
          setDescription(category.description || "");
          setImagePreview(category.image || null);
          if (category.subCategory?.id) {
            setParentId(category.subCategory.id);
          }
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
          // Handle error (e.g., show toast)
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 2MB",
        }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: undefined })); // clear error
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Validation & Submit
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "This field is required";
    if (!description.trim()) newErrors.description = "This field is required";
    if (!imagePreview && !imageFile) newErrors.image = "This field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData if uploading a file, otherwise send JSON
      //   const formData = new FormData();
      //   formData.append("name", name);
      //   formData.append("description", description);
      //   if (parentId) formData.append("subCategoryId", parentId);
      //   if (imageFile) formData.append("image", imageFile);

      //   if (isEditMode) {
      //     await axios.put(`/api/categories/${id}`, formData);
      //   } else {
      //     await axios.post("/api/categories", formData);
      //   }

      navigate("/dashboard/categories"); // Adjust route as needed
    } catch (error) {
      console.error("Failed to save category", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-category-container">
      {/* Header */}
      <div className="create-category-top-bar">
        <button
          className="create-category-back-btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Back to Categories
        </button>
        <h1 className="create-category-title">
          {isEditMode ? "Edit Category" : "Create New Category"}
        </h1>
      </div>

      {/* Main Grid Layout */}
      <div className="create-category-grid">
        {/* LEFT COLUMN: Image & Tips */}
        <div className="create-category-left-col">
          <div className="create-category-field-group">
            <label className="create-category-label">Category Image</label>

            <div
              className={`create-category-image-upload-box ${errors.image ? "error-border" : ""}`}
            >
              {imagePreview ? (
                <div className="create-category-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="create-category-preview-img"
                  />
                  <button
                    className="create-category-remove-image-btn"
                    onClick={removeImage}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div
                  className="create-category-upload-prompt"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUploadCloud className="create-category-upload-icon" />
                  <p className="create-category-upload-text">
                    Click to upload or drag and drop
                  </p>
                  <p className="create-category-upload-subtext">
                    Max size 2MB (JPG, PNG)
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
              <p className="create-category-error-text">! {errors.image}</p>
            )}
          </div>

          <div className="create-category-pro-tip">
            <div className="create-category-tip-icon">
              <FaLightbulb />
            </div>
            <div className="create-category-tip-content">
              <strong>Pro Tip</strong>
              <p>
                Use high-resolution minimalist photography to maintain the
                curated luxury aesthetic of your storefront.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Details */}
        <div className="create-category-right-col">
          <div className="create-category-card">
            <div className="create-category-field-group">
              <div className="create-category-label-row">
                <label className="create-category-label">CATEGORY NAME</label>
                <span className="create-category-hint">
                  Visible to customers
                </span>
              </div>
              <input
                type="text"
                className={`create-category-input ${errors.name ? "error-input" : ""}`}
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="create-category-error-text">! {errors.name}</p>
              )}
            </div>

            <div className="create-category-field-group">
              <label className="create-category-label">DESCRIPTION</label>
              <textarea
                className={`create-category-textarea ${errors.description ? "error-input" : ""}`}
                placeholder="Enter a brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
              {errors.description && (
                <p className="create-category-error-text">
                  ! {errors.description}
                </p>
              )}
            </div>

            <div className="create-category-field-group">
              <label className="create-category-label">PARENT CATEGORY</label>
              {/* Using your custom Dropdown */}
              <Dropdown
                options={parentOptions}
                label={parentId ? parentId : "Select Parent Category"}
                onSelect={(val: any) => setParentId(val)}
                // placeholder="Select Parent (Optional)"
                width="250px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="create-category-footer">
        <DashBoardButton
          icon={<FiX size={25} />}
          name="Cancel"
          variant="secondary"
          onClick={() => navigate(-1)}
        />
        <DashBoardButton
          icon={<IoMdAddCircleOutline size={25} />}
          name={isEditMode ? "Save Changes" : "Create Category"}
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateOrEditCategory;
