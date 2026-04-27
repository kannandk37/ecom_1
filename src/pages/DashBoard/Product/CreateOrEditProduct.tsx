import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiUploadCloud, FiX, FiInfo } from "react-icons/fi";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditProduct.css";
import {
  Duration,
  Unit,
  Storage,
  Label,
  Product,
} from "../../../entity/product";
import Loader2 from "../../../assets/loader/Loader2";
import { FaIndianRupeeSign } from "react-icons/fa6";

const CreateOrEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form States - Core
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [brandId, setBrandId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [shortDescription, setShortDescription] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Form States - Pricing & Logistics
  const [price, setPrice] = useState("");
  const [origin, setOrigin] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<{
    id: string;
    label: string;
    value: string;
  }>();
  const [shelfLife, setShelfLife] = useState("");
  const [shelfLifeDuration, setShelfLifeDuration] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [storage, setStorage] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);

  // Image States (Max 6)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [brandOptions, setBrandOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown Options
  const unitOptions = [
    { id: "1", label: "Gram (g)", value: Unit.G },
    { id: "2", label: "Kilogram (kg)", value: Unit.KG },
  ];
  const durationOptions = [
    { id: "1", label: "Days", value: Duration.DAY },
    { id: "2", label: "Weeks", value: Duration.WEEK },
    { id: "3", label: "Months", value: Duration.MONTH },
    { id: "4", label: "Years", value: Duration.YEAR },
  ];
  const storageOptions = [
    { id: "1", label: "Cool Place", value: Storage.COOL_PLACE },
    { id: "2", label: "Dry Place", value: Storage.DRY_PLACE },
    { id: "3", label: "Cool & Dry Place", value: Storage.COOL_DRY_PLACE },
  ];
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Fetch Categories & Brands
    const fetchDependencies = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios
            .get("/api/categories")
            .catch(() => ({ data: [{ id: "cat1", name: "Nuts" }] })), // Fallbacks for testing
          axios
            .get("/api/brands")
            .catch(() => ({ data: [{ id: "br1", name: "Nature Farms" }] })),
        ]);

        setCategoryOptions(
          catRes.data.map((c: any) => ({ label: c.name, value: c.id })),
        );
        setBrandOptions(
          brandRes.data.map((b: any) => ({ label: b.name, value: b.id })),
        );
      } catch (err) {
        console.error("Failed to fetch dependencies", err);
      }
    };

    fetchDependencies();

    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`/api/products/${id}`)
        .then((res) => {
          const product: Product = res.data;
          setName(product.name || "");
          setCategoryId({
            id: product.category?.id,
            label: product.category?.name,
            value: product.category?.name,
          });
          setBrandId({
            id: product.brand?.id,
            label: product.brand?.name,
            value: product.brand?.name,
          });
          setShortDescription(product.shortDescription || "");
          setDescription(product.description || "");
          setPrice(product.price?.toString() || "");
          setWeight(product.weight || "");
          if (product.unit)
            setUnit({ id: "", label: product.unit, value: product.unit });
          setExistingImages(product.images || []);

          // Parse Specs
          if (product.specs) {
            product.specs.forEach((spec) => {
              if (spec.label === Label.ORIGIN) setOrigin(spec.value as string);
              if (spec.label === Label.STORAGE)
                setStorage({
                  id: spec.value,
                  label: spec.value,
                  value: spec.value,
                });
              if (spec.label === Label.SHELF_LIFE) {
                // Assuming format like "6 month" or handling string split
                const parts = (spec.value as string).split(" ");
                setShelfLife(parts[0] || "");
                if (parts[1])
                  setShelfLifeDuration({
                    id: parts[1],
                    label: parts[1],
                    value: parts[1],
                  });
              }
            });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  // Image Handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages =
        existingImages.length + newImageFiles.length + files.length;

      if (totalImages > 6) {
        setErrors((prev) => ({ ...prev, images: "Maximum 6 images allowed." }));
        return;
      }

      const validFiles = files.filter((f) => f.size <= 2 * 1024 * 1024);
      if (validFiles.length < files.length) {
        setErrors((prev) => ({
          ...prev,
          images: "Some files exceeded the 2MB limit and were removed.",
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

  // Submit
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name) newErrors.name = "Required";
    if (!categoryId) newErrors.category = "Required";
    if (!brandId) newErrors.brand = "Required";
    if (!shortDescription) newErrors.shortDescription = "Required";
    if (!description) newErrors.description = "Required";
    if (!price) newErrors.price = "Required";
    if (!weight) newErrors.weight = "Required";
    if (!origin) newErrors.origin = "Required";
    if (!shelfLife) newErrors.shelfLife = "Required";
    if (!storage) newErrors.storage = "Required";
    if (existingImages.length === 0 && newImageFiles.length === 0)
      newErrors.images = "At least one image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top to show errors if needed
      return;
    }

    setIsLoading(true);

    try {
      //   const formData = new FormData();
      //   formData.append('name', name);
      //   formData.append('categoryId', categoryId);
      //   formData.append('brandId', brandId);
      //   formData.append('shortDescription', shortDescription);
      //   formData.append('description', description);
      //   formData.append('price', price);
      //   formData.append('weight', weight);
      //   formData.append('unit', unit);

      //   // Spec mapping based on entity
      //   const specs = [
      //     { label: Label.ORIGIN, value: origin },
      //     { label: Label.SHELF_LIFE, value: `${shelfLife} ${shelfLifeDuration}` },
      //     { label: Label.STORAGE, value: storage }
      //   ];
      //   formData.append('specs', JSON.stringify(specs));

      //   // Append existing images that weren't deleted
      //   formData.append('existingImages', JSON.stringify(existingImages));

      //   // Append new files
      //   newImageFiles.forEach(file => {
      //     formData.append('images', file);
      //   });

      //   if (isEditMode) {
      //     await axios.put(`/api/products/${id}`, formData);
      //   } else {
      //     await axios.post('/api/products', formData);
      //   }

      navigate("/dashboard/products");
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, submit: "Failed to save product." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="create-product-container">
          {/* Header */}
          <div className="create-product-header-wrapper">
            <div className="create-product-title-area">
              <button
                className="create-product-back-btn"
                onClick={() => navigate("/dashboard/products")}
              >
                <FiArrowLeft /> Back to Products
              </button>
              <h1 className="create-product-title">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h1>
              <p className="create-product-subtitle">
                Curate a new addition to the organic collection.
              </p>
            </div>
            {/* <div className="create-product-top-actions">
              <DashBoardButton
                name="Cancel"
                variant="secondary"
                onClick={() => navigate("/dashboard/products")}
              />
              <DashBoardButton
                name={isEditMode ? "Save Changes" : "Create Product"}
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              />
            </div> */}
          </div>

          <div className="create-product-sections-wrapper">
            {/* Section 1: Core Details */}
            <div className="create-product-card">
              <div className="create-product-card-header">
                <span className="create-product-section-number">1</span>
                <h2>Core Details</h2>
              </div>

              <div className="create-product-card-body">
                <div className="create-product-field-group">
                  <label>
                    Product Name <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    placeholder="e.g. Premium Medjool Dates"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <span className="create-product-error">{errors.name}</span>
                  )}
                </div>

                <div className="create-product-row-split">
                  <div className="create-product-field-group">
                    <label>
                      Select Category <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={categoryOptions}
                      onSelect={(val: any) => setCategoryId(val)}
                      label={categoryId ? categoryId.label : "Select category"}
                    />
                    {errors.category && (
                      <span className="create-product-error">
                        {errors.category}
                      </span>
                    )}
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Select Brand <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={brandOptions}
                      onSelect={(val: any) => setBrandId(val)}
                      label={brandId ? brandId.label : "Select brand"}
                    />
                    {errors.brand && (
                      <span className="create-product-error">
                        {errors.brand}
                      </span>
                    )}
                  </div>
                </div>

                <div className="create-product-field-group">
                  <label>
                    Short Description <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    placeholder="e.g. Pure Himalayan Wildflower Honey"
                    value={shortDescription}
                    onChange={(e: any) => setShortDescription(e.target.value)}
                  />
                  {errors.shortDescription && (
                    <span className="create-product-error">
                      {errors.shortDescription}
                    </span>
                  )}
                </div>

                <div className="create-product-field-group">
                  <label>
                    Full Description <span className="req">*</span>
                  </label>
                  <textarea
                    className={`create-product-textarea ${errors.description ? "error-border" : ""}`}
                    placeholder="Describe the origin, benefits, and unique qualities of the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                  {errors.description && (
                    <span className="create-product-error">
                      {errors.description}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Product Media */}
            <div className="create-product-card">
              <div className="create-product-card-header">
                <span className="create-product-section-number">2</span>
                <div>
                  <h2>Product Media</h2>
                  <p className="create-product-subtext">
                    Up to 6 images can be uploaded. Max size{" "}
                    <strong>2MB</strong> per image.
                  </p>
                </div>
              </div>

              <div className="create-product-card-body">
                <div className="create-product-media-grid">
                  {/* Upload Trigger */}
                  {existingImages.length + newImageFiles.length < 6 && (
                    <div
                      className="create-product-upload-box"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiUploadCloud className="create-product-upload-icon" />
                      <span>
                        Upload <span className="req">*</span>
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

                  {/* Existing Images */}
                  {existingImages.map((url, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="create-product-preview-box"
                    >
                      <img src={url} alt={`Existing ${idx}`} />
                      <button
                        className="create-product-remove-img"
                        onClick={() => removeExistingImage(idx)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}

                  {/* New Previews */}
                  {newImagePreviews.map((url, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="create-product-preview-box"
                    >
                      <img src={url} alt={`Preview ${idx}`} />
                      <button
                        className="create-product-remove-img"
                        onClick={() => removeNewImage(idx)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && (
                  <span className="create-product-error">{errors.images}</span>
                )}
              </div>
            </div>

            {/* Section 3: Pricing & Logistics */}
            <div className="create-product-card">
              <div className="create-product-card-header">
                <span className="create-product-section-number">3</span>
                <h2>Pricing & Logistics</h2>
              </div>

              <div className="create-product-card-body">
                <div className="create-product-row-split">
                  <div className="create-product-field-group">
                    <label>
                      Price <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        icon={<FaIndianRupeeSign />}
                        placeholder="0.00"
                        value={price}
                        onChange={(e: any) => setPrice(e.target.value)}
                        type="number"
                      />
                    </div>
                    {errors.price && (
                      <span className="create-product-error">
                        {errors.price}
                      </span>
                    )}
                  </div>

                  <div className="create-product-field-group">
                    <label>
                      Origin <span className="req">*</span>
                    </label>
                    <DashBoardInput
                      placeholder="e.g. Kashmir, India"
                      value={origin}
                      onChange={(e: any) => setOrigin(e.target.value)}
                    />
                    {errors.origin && (
                      <span className="create-product-error">
                        {errors.origin}
                      </span>
                    )}
                  </div>
                </div>

                <div className="create-product-row-split">
                  <div className="create-product-field-group">
                    <label>
                      Weight & Unit <span className="req">*</span>
                    </label>
                    <div className="create-product-combined-input">
                      <div className="combined-left">
                        <DashBoardInput
                          placeholder="Value"
                          value={weight}
                          onChange={(e: any) => setWeight(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="combined-right">
                        <Dropdown
                          options={unitOptions}
                          onSelect={(val: any) => setUnit(val)}
                          label={unit?.label ? unit.label : "Select Unit"}
                          width="250px"
                        />
                      </div>
                    </div>
                    {errors.weight && (
                      <span className="create-product-error">
                        {errors.weight}
                      </span>
                    )}
                  </div>

                  <div className="create-product-field-group">
                    <label>
                      Shelf Life <span className="req">*</span>
                    </label>
                    <div className="create-product-combined-input">
                      <div className="combined-left">
                        <DashBoardInput
                          placeholder="Duration"
                          value={shelfLife}
                          onChange={(e: any) => setShelfLife(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="combined-right">
                        <Dropdown
                          width="250px"
                          options={durationOptions}
                          onSelect={(val: any) => setShelfLifeDuration(val)}
                          label={
                            shelfLifeDuration?.label
                              ? shelfLifeDuration.label
                              : "Select Duration"
                          }
                        />
                      </div>
                    </div>
                    {errors.shelfLife && (
                      <span className="create-product-error">
                        {errors.shelfLife}
                      </span>
                    )}
                  </div>
                </div>

                <div className="create-product-row-split">
                  {/* Empty div for alignment to match screenshot (Storage on right) */}
                  <div className="create-product-field-group">
                    <label>
                      Storage <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={storageOptions}
                      onSelect={(val: any) => setStorage(val)}
                      label={
                        storage?.label
                          ? storage.label
                          : "Select storage condition"
                      }
                    />
                    {errors.storage && (
                      <span className="create-product-error">
                        {errors.storage}
                      </span>
                    )}
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Feature 1 <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        placeholder="about product"
                        value={features[1] || ""}
                        onChange={(e: any) =>
                          setFeatures([
                            (features[1] = e),
                            features[2],
                            features[3],
                          ])
                        }
                      />
                    </div>
                    {errors.price && (
                      <span className="create-product-error">
                        {errors.price}
                      </span>
                    )}
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Feature 2 <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        placeholder="about product"
                        value={features[2] || ""}
                        onChange={(e: any) =>
                          setFeatures([
                            features[1],
                            (features[2] = e),
                            features[3],
                          ])
                        }
                      />
                    </div>
                    {errors.price && (
                      <span className="create-product-error">
                        {errors.price}
                      </span>
                    )}
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Feature 3 <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        placeholder="about product"
                        value={features[3] || ""}
                        onChange={(e: any) =>
                          setFeatures([
                            features[1],
                            features[2],
                            (features[3] = e),
                          ])
                        }
                      />
                    </div>
                    {errors.price && (
                      <span className="create-product-error">
                        {errors.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Action Bar */}
          <div className="create-product-footer-bar">
            <div className="create-product-draft-info">
              <FiInfo className="info-icon" />
              <div>
                <strong>Draft Saved</strong>
                <p>
                  Your progress is automatically saved. Complete all required
                  fields to publish.
                </p>
              </div>
            </div>
            <div className="create-product-bottom-actions">
              <DashBoardButton
                name="Cancel"
                variant="secondary"
                onClick={() => navigate("/dashboard/products")}
              />
              <DashBoardButton
                name={isEditMode ? "Save Changes" : "Create Product"}
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateOrEditProduct;
