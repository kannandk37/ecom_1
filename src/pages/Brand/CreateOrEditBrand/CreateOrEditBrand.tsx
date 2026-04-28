import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiUploadCloud, FiX } from "react-icons/fi";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput, {
  DashboardInput,
} from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditBrand.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Brand } from "../../../entity/brand/index";
import { BrandService } from "../../../service/brand";
import { Category } from "../../../entity/category";
import { CategoryService } from "../../../service/category";
import Loader2 from "../../../assets/loader/Loader2";

const CreateOrEditBrand: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [nameError, setNameError] = useState<string>(null);
  const [descriptionError, setDescriptionError] = useState<string>(null);
  const [imageFileError, setImageFileError] = useState<string>(null);
  const [categoryIdError, setCategoryIdError] = useState<string>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let response = await new CategoryService().get();
        let options = response.map((category: Category) => {
          return {
            id: category.id,
            label: category.name,
            value: category.name,
          };
        });
        setCategoryOptions(options);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          let brand = await new BrandService().getById(id);
          setName(brand.name);
          setDescription(brand.description);
          // setImageFile(brand.image);
          if (brand.category) {
            setCategoryId({
              id: brand.category.id,
              label: brand.category.name,
              value: brand.category.name,
            });
          }
        } catch (error) {
          console.error("Failed to get Brand", error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [id, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        // setErrors((prev) => ({
        //   ...prev,
        //   image: "File size must be less than 2MB",
        // }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const isValid = () => {
    if (!name.trim()) {
      setNameError("Please Provide Brand Name");
    } else if (!categoryId?.id) {
      setCategoryIdError("Please Select Category");
    } else if (!description.trim()) {
      setDescriptionError("Please Provide Brand Description");
      // } else if (!imagePreview && !imageFile) {
      //   setImageFileError("Please Provide Brand Image");
    } else {
      console.log('geras', categoryId);
      return true;
    }
    return false;
  };

  // Validation & Submit
  const handleSubmit = async () => {
    setIsLoading(true);
    if (isValid()) {
      try {
        const brand = new Brand();
        brand.name = name;
        brand.description = description;
        let category = new Category();
        category.id = categoryId?.id;
        brand.category = category;
        //brand.image = imageFile;

        if (isEditMode) {
          await new BrandService().updateById(id, brand);
        } else {
          await new BrandService().create(brand);
        }

        navigate("/dashboard/brands");
      } catch (error) {
        console.error("Failed to save brand", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const OnChangeName = (name: string) => {
    if (name?.length > 60) {
      setNameError("Only 60 characters allowed");
    } else {
      // add any regexs
      setName(name);
      setNameError(null);
    }
  };

  const OnChangeDescription = (description: string) => {
    if (description?.length > 300) {
      setDescriptionError("Only 300 characters allowed");
    } else {
      // add any regexs
      setDescription(description);
      setDescriptionError(null);
    }
  };

  return (
    <>
      {isLoading ?
        (
          <Loader2 />
        ) : (
          <div className="create-brand-container">
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

            <div className="create-brand-grid">
              <div className="create-brand-left-col">
                <div className="create-brand-form-card">
                  <div className="create-brand-row-split">
                    <div className="create-brand-field-group">
                      <label className="create-brand-label">Brand Name</label>
                      <DashBoardInput
                        type="text"
                        placeholder="Enter Brand name"
                        value={name}
                        onChange={(value: string) => OnChangeName(value)}
                        error={nameError ? true : false}
                        errorMessage={nameError}
                        required={true}
                      />
                      {/* {errors.name && (
                  <p className="create-brand-error-text">! {errors.name}</p>
                )} */}
                    </div>

                    <div className="create-brand-field-group">
                      <label className="create-brand-label">Select Category</label>
                      <Dropdown
                        options={categoryOptions}
                        label={categoryId ? categoryId.label : "Choose a Category"}
                        onSelect={(val: any) => { setCategoryId(val); setCategoryIdError(null) }}
                        //   placeholder="Choose a category"
                        width="250px"
                        error={categoryIdError ? true : false}
                        errorMessage={categoryIdError}
                      />
                      {/* {errors.category && (
                  <p className="create-brand-error-text">! {errors.category}</p>
                )} */}
                    </div>
                  </div>

                  <div className="create-brand-field-group">
                    <label className="create-brand-label">Description</label>
                    <DashboardInput
                      type="textarea"
                      placeholder="Enter Description"
                      value={description}
                      required={true}
                      onChange={(value: string) => OnChangeDescription(value)}
                      error={descriptionError ? true : false}
                      errorMessage={descriptionError}
                    />
                    {/*<textarea
                className={`create-brand-textarea ${errors.description ? "error-border" : ""}`}
                placeholder="Enter a brief brand description"
                value={description}
                rows={6}
              />
              {errors.description && (
                <p className="create-brand-error-text">
                  ! {errors.description}
                </p>
              )} */}
                  </div>
                </div>

                <div className="create-brand-actions">
                  <DashBoardButton
                    icon={<FiX size={25} />}
                    name="Cancel"
                    variant="secondary"
                    onClick={() => navigate("/dashboard/brands")}
                    width={"250px"}
                  />
                  <DashBoardButton
                    icon={<FiPlus size={25} />}
                    name={isEditMode ? "Save Changes" : "Create Brand"}
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    width={"250px"}
                  />
                </div>
              </div>

              <div className="create-brand-right-col">
                <div className="create-brand-field-group">
                  <label className="create-brand-label">Brand Image</label>

                  <div
                    className={`create-brand-image-upload-box ${imageFileError ? "error-border" : ""}`}
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
                  {imageFileError && (
                    <p className="create-brand-error-text">! {imageFileError}</p>
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
        )}
    </>
  );
};

export default CreateOrEditBrand;
