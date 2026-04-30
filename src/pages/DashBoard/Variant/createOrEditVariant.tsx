import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiX,
  FiBox,
  FiImage,
  FiPlus,
} from "react-icons/fi";

import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditVariant.css";
import { Variant, VariantGrade, VariantType } from "../../../entity/variant";
import { ProductService } from "../../../service/product";
import { Product } from "../../../entity/product";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { VariantService } from "../../../service/variant";
import Loader2 from "../../../assets/loader/Loader2";

const CreateOrEditVariant: React.FC = () => {
  const { id = "69f3c4cd84c187aa7de7c0b2" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Core Form States
  const [name, setName] = useState<string>("");
  const [productId, setProductId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [type, setType] = useState<{
    id: VariantType;
    label: VariantType;
    value: VariantType;
  }>(null);
  const [grade, setGrade] = useState<{
    id: VariantGrade;
    label: VariantGrade;
    value: VariantGrade;
  }>(null);

  // Inventory & Pricing States
  const [price, setPrice] = useState<number>(0);
  const [nameError, setNameError] = useState<string>(null);
  const [productIdError, setProductIdError] = useState<string>(null);
  const [typeError, setTypeError] = useState<string>(null);
  const [gradeError, setGradeError] = useState<string>(null);
  const [priceError, setPriceError] = useState<string>(null);
  const [newImagePreviewsError, setNewImagePreviewsError] =
    useState<string>(null);

  // const [sku, setSku] = useState("");
  // const [stockQuantity, setStockQuantity] = useState("");

  // Image States (Max 6)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(null);
  const [productOptions, setProductOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown Configurations
  const typeOptions = [
    { id: VariantType.FULL, label: VariantType.FULL, value: VariantType.FULL },
    {
      id: VariantType.BROKE,
      label: VariantType.BROKE,
      value: VariantType.BROKE,
    },
    {
      id: VariantType.SPARE,
      label: VariantType.SPARE,
      value: VariantType.SPARE,
    },
  ];

  const gradeOptions = [
    {
      id: VariantGrade.GRADE1,
      label: VariantGrade.GRADE1,
      value: VariantGrade.GRADE1,
    },
    {
      id: VariantGrade.GRADE2,
      label: VariantGrade.GRADE2,
      value: VariantGrade.GRADE2,
    },
  ];

  // Fetch Data on Load
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let products = await new ProductService().get();
        if (products?.length > 0) {
          let productsOptionsData = products.map((product: Product) => {
            return {
              id: product.id,
              label: product.name,
              value: product.name,
            };
          });
          setProductOptions(productsOptionsData);
        } else {
          setProductOptions(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, isEditMode]);

  useEffect(() => {
    (async () => {
      if (id && isEditMode) {
        setIsLoading(true);
        try {
          if (isEditMode) {
            let variantWithId = await new VariantService().getById(id);
            if (variantWithId) {
              setName(variantWithId.name);
              setProductId({
                id: variantWithId.product?.id,
                label: variantWithId.product?.name,
                value: variantWithId.product?.name,
              });
              setType({
                id: variantWithId.type,
                label: variantWithId.type,
                value: variantWithId.type,
              });
              setGrade({
                id: variantWithId.grade,
                label: variantWithId.grade,
                value: variantWithId.grade,
              });
              setPrice(variantWithId.price || 0);
              // setSku(variantWithId.sku || "");
              // setStockQuantity(variantWithId.stockQuantity?.toString() || "");
              // setExistingImages(variantWithId.images || []);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [id, isEditMode]);

  // Image Handling Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentTotal = existingImages.length + newImageFiles.length;

      if (currentTotal + files.length > 6) {
        setNewImagePreviewsError("Maximum 6 images allowed.");
        return;
      }

      const validFiles = files.filter((f) => f.size <= 5 * 1024 * 1024); // 5MB limit
      if (validFiles.length < files.length) {
        setNewImagePreviewsError(
          "Some files exceeded the 5MB limit and were removed.",
        );
      } else {
        setNewImagePreviewsError(null);
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

  const isValid = () => {
    console.log(newImagePreviewsError, "newImagePreviewsError");
    if (!name) {
      setNameError("Please Provide Name");
    } else if (!productId) {
      setProductIdError("Please Select Product");
    } else if (!type) {
      setTypeError("Please Select Type");
    } else if (!grade) {
      setGradeError("Please Select Grade");
    } else if (price <= 0) {
      setPriceError("Please Provide Price");
    } else if (
      newImagePreviewsError == null ||
      newImagePreviewsError?.length < 1
    ) {
      setNewImagePreviewsError("Please Provide At Least One Image");
    } else {
      return true;
    }
    return false;
  };

  // Submit Handler
  const handleSubmit = async () => {
    // if (!sku.trim()) newErrors.sku = "Required";
    // if (!stockQuantity) newErrors.stockQuantity = "Required";

    if (isValid()) {
      setIsLoading(true);
      try {
        let variant = new Variant();
        variant.name = name;
        let product = new Product();
        product.id = productId.id;
        variant.product = product;
        variant.type = type.value;
        variant.grade = grade.value;
        variant.price = price;
        // variant.images = newImageFiles;

        if (isEditMode) {
          await new VariantService().updateById(id, variant);
        } else {
          await new VariantService().create(variant);
        }

        navigate("/dashboard/products"); // Redirect to products
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      nameError ||
      productIdError ||
      typeError ||
      gradeError ||
      priceError ||
      newImagePreviewsError
    ) {
      setError("Please Provide All Required Fields");
    } else {
      setError(null);
    }
  }, [
    nameError,
    productIdError,
    typeError,
    gradeError,
    priceError,
    newImagePreviewsError,
  ]);

  const OnChangeName = (name: string) => {
    if (name?.length > 60) {
      setNameError("Only 60 characters allowed");
    } else {
      // add any regexs
      setName(name);
      setNameError(null);
    }
  };

  const onSelectProductId = (val: any) => {
    setProductId(val);
    setProductIdError(null);
  };

  const onSelectType = (val: any) => {
    setType(val);
    setTypeError(null);
  };

  const onSelectGrade = (val: any) => {
    setGrade(val);
    setGradeError(null);
  };

  const onChangePrice = (price: number) => {
    if (price < 0) {
      setPriceError("Plese Provide price");
    } else {
      // add any regexs
      setPrice(price);
      setPriceError(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="create-variant-container">
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
                    onChange={(e: any) => OnChangeName(e)}
                    error={nameError ? true : false}
                    errorMessage={nameError}
                  />
                </div>

                <div className="create-variant-field-group">
                  <label>
                    Select Product <span className="req">*</span>
                  </label>
                  <Dropdown
                    width="250px"
                    options={productOptions}
                    onSelect={(val: any) => onSelectProductId(val)}
                    label={
                      productId?.label ? productId.label : "Select Product"
                    }
                    error={productIdError ? true : false}
                    errorMessage={productIdError}
                  />
                </div>

                <div className="create-variant-row-split">
                  <div className="create-variant-field-group">
                    <label>
                      Type <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={typeOptions}
                      onSelect={(val: any) => onSelectType(val)}
                      label={type?.label ? type?.label : "Select Type"}
                      error={typeError ? true : false}
                      errorMessage={typeError}
                    />
                  </div>
                  <div className="create-variant-field-group">
                    <label>
                      Grade <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={gradeOptions}
                      onSelect={(val: any) => onSelectGrade(val)}
                      label={grade?.label ? grade.label : "Select Grade"}
                      error={gradeError ? true : false}
                      errorMessage={gradeError}
                    />
                  </div>
                </div>

                <div className="create-variant-row-split">
                  <div className="create-variant-field-group">
                    <label>
                      Price (₹) <span className="req">*</span>
                    </label>
                    <DashBoardInput
                      icon={<FaIndianRupeeSign />}
                      placeholder="0.00"
                      value={price?.toString()}
                      onChange={(e: any) => onChangePrice(e)}
                      type="number"
                      error={priceError ? true : false}
                      errorMessage={priceError}
                    />
                  </div>
                </div>

                {/* <div className="create-variant-row-split">
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
            </div> */}
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
                    className={`create-variant-upload-area ${newImagePreviewsError ? "error-border" : ""}`}
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
                {newImagePreviewsError && (
                  <span className="create-variant-error">
                    {newImagePreviewsError}
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
                    <div
                      key={`new-${idx}`}
                      className="create-variant-preview-box"
                    >
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
                    <div
                      key={`empty-${idx}`}
                      className="create-variant-empty-box"
                    >
                      <FiImage />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="create-variant-error-overall">
              <div className="create-variant-error-overall-info">
                <FaExclamationTriangle />
              </div>
              <div>
                <strong>Please Fill All Required Field</strong>
              </div>
            </div>
          )}
          <div className="create-variant-footer">
            <DashBoardButton
              icon={<FiX size={25} />}
              width={"280px"}
              name="Cancel"
              variant="secondary"
              onClick={() => navigate("/dashboard/products")}
            />
            <DashBoardButton
              icon={<FiPlus size={25} />}
              width={"280px"}
              name={isEditMode ? "Save Changes" : "Create Variant"}
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateOrEditVariant;
