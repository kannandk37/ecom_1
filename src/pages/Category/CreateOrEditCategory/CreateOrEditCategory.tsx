import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUploadCloud, FiX } from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";
import DashBoardButton from "../../../assets/ui/DashBoardButton/DashBoardButton";
import Dropdown from "../../../assets/dropdown/DropDown";
import "./CreateOrEditCategory.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Category } from "../../../entity/category";
import { CategoryService } from "../../../service/category";
import DashboardInput from "../../../assets/ui/DashBoardInput/DashBoardInput";
import Loader2 from "../../../assets/loader/Loader2";

const CreateOrEditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [parentId, setParentId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nameError, setNameError] = useState<string>(null);
  const [descriptionError, setDescriptionError] = useState<string>(null);
  const [imageFileError, setImageFileError] = useState<string>(null);
  const [parentOptions, setParentOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
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
        setParentOptions(id ? options.filter((el) => el.id != id) : options);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          let category = await new CategoryService().getById(id);
          setName(category.name);
          setDescription(category.description);
          // setImageFile(category.image);
          if (category.subCategory) {
            setParentId({
              id: category.subCategory.id,
              label: category.subCategory.name,
              value: category.subCategory.name,
            });
          }
        } catch (error) {
          console.error("Failed to get category", error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [id, isEditMode]);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation
      if (file.size > 2 * 1024 * 1024) {
        setImageFileError("File size must be less than 2MB");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageFileError(null);
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
      // } else if (!imagePreview && !imageFile) {
      //   setImageFileError("Please Provide Category Image");
    } else {
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isValid()) {
      try {
        let category = new Category();
        category.name = name?.trim();
        category.description = description?.trim();
        // category.image = imageFile as any //TODO: need to upload and return the url
        if (parentId) {
          let subCategory = new Category();
          subCategory.id = parentId.id;
          category.subCategory = subCategory;
        }

        if (isEditMode) {
          await new CategoryService().updateById(id, category);
        } else {
          await new CategoryService().create(category);
        }

        navigate("/dashboard/categories");
      } catch (error) {
        console.error("Failed to save category", error);
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
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="create-category-container">
          <div className="create-category-top-bar">
            <button
              className="create-category-back-btn"
              onClick={() => navigate("/dashboard/categories")}
            >
              <FiArrowLeft /> Back to Categories
            </button>
            <h1 className="create-category-title">
              {isEditMode ? "Edit Category" : "Create New Category"}
            </h1>
          </div>

          <div className="create-category-grid">
            <div className="create-category-left-col">
              <div className="create-category-field-group">
                <label className="create-category-label">Category Image</label>
                <div
                  className={`create-category-image-upload-box ${imageFileError ? "error-border" : ""}`}
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
                {imageFileError && (
                  <p className="create-category-error-text">
                    ! {imageFileError}
                  </p>
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

            <div className="create-category-right-col">
              <div className="create-category-card">
                <div className="create-category-field-group">
                  <div className="create-category-label-row">
                    <label className="create-category-label">
                      CATEGORY NAME
                    </label>
                    <span className="create-category-hint">
                      Visible to customers
                    </span>
                  </div>
                  <DashboardInput
                    type="text"
                    placeholder="Enter Category name"
                    value={name}
                    onChange={(value: string) => OnChangeName(value)}
                    error={nameError ? true : false}
                    errorMessage={nameError}
                    required={true}
                  />
                </div>

                <div className="create-category-field-group">
                  <label className="create-category-label">DESCRIPTION</label>
                  <DashboardInput
                    type="textarea"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(value: string) => OnChangeDescription(value)}
                    error={descriptionError ? true : false}
                    errorMessage={descriptionError}
                    required={true}
                  />
                </div>

                <div className="create-category-field-group">
                  <label className="create-category-label">
                    PARENT CATEGORY
                  </label>
                  {/* Using your custom Dropdown */}
                  <Dropdown
                    options={parentOptions}
                    label={parentId ? parentId.label : "Select Parent Category"}
                    onSelect={(val: any) => setParentId(val)}
                    // placeholder="Select Parent (Optional)"
                    width="250px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="create-category-footer">
            <DashBoardButton
              icon={<FiX size={25} />}
              name="Cancel"
              variant="secondary"
              onClick={() => navigate("/dashboard/categories")}
              width={"250px"}
            />
            <DashBoardButton
              icon={<IoMdAddCircleOutline size={25} />}
              name={isEditMode ? "Save Changes" : "Create Category"}
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              width={"250px"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateOrEditCategory;
