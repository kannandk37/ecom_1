import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUploadCloud, FiX, FiPlus } from "react-icons/fi";
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
import { FaExclamation, FaIndianRupeeSign } from "react-icons/fa6";
import { CategoryService } from "../../../service/category";
import { Category } from "../../../entity/category";
import { BrandService } from "../../../service/brand";
import { Brand } from "../../../entity/brand";
import { FaExclamationTriangle } from "react-icons/fa";
import { ProductService } from "../../../service/product";

const CreateOrEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form States - Core
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
  const [categoryIdError, setCategoryIdError] = useState<string>(null);
  const [brandIdError, setBrandIdError] = useState<string>(null)
  const [name, setName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");


  const [titleError, setTitleError] = useState<string>("");
  const [nameError, setNameError] = useState<string>(null);
  const [shortDescriptionError, setShortDescriptionError] = useState<string>(null);
  const [descriptionError, setDescriptionError] = useState<string>(null);


  // Form States - Pricing & Logistics
  const [price, setPrice] = useState<number>(0);
  const [origin, setOrigin] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [priceError, setPriceError] = useState<string>(null);
  const [originError, setOriginError] = useState<string>(null);
  const [weightError, setWeightError] = useState<string>(null);
  const [unit, setUnit] = useState<{
    id: string;
    label: string;
    value: string;
  }>();
  const [unitError, setUnitError] = useState<string>(null);
  const [shelfLife, setShelfLife] = useState<string>("");
  const [shelfLifeError, setShelfLifeError] = useState<string>(null);
  const [shelfLifeDuration, setShelfLifeDuration] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [shelfLifeDurationError, setShelfLifeDurationError] = useState<string>(null);
  const [storage, setStorage] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [storageError, setStorageError] = useState<string>(null)
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
  const durationOptionsData = [
    { id: "1", label: "Day", value: Duration.DAY },
    { id: "2", label: "Days", value: Duration.DAYS },
    { id: "3", label: "Week", value: Duration.WEEK },
    { id: "4", label: "Weeks", value: Duration.WEEKS },
    { id: "5", label: "Month", value: Duration.MONTH },
    { id: "6", label: "Months", value: Duration.MONTHS },
    { id: "7", label: "Year", value: Duration.YEAR },
    { id: "8", label: "Years", value: Duration.YEARS },
  ];
  const storageOptions = [
    { id: "1", label: "Cool Place", value: Storage.COOL_PLACE },
    { id: "2", label: "Dry Place", value: Storage.DRY_PLACE },
    { id: "3", label: "Cool & Dry Place", value: Storage.COOL_DRY_PLACE },
  ];
  const [features, setFeatures] = useState<string[]>([]);
  const [feature1Error, setFeature1Error] = useState<string>(null);
  const [feature2Error, setFeature2Error] = useState<string>(null);
  const [feature3Error, setFeature3Error] = useState<string>(null);
  // const nameRef = useRef(null);
  const [error, setError] = useState<boolean>(false);

  const [durationOptions, setDurationOptions] = useState<any[]>(durationOptionsData);
  useEffect(() => {
    if (Number(shelfLife) > 1) {
      setDurationOptions([
        { id: "2", label: "Days", value: Duration.DAYS },
        { id: "4", label: "Weeks", value: Duration.WEEKS },
        { id: "6", label: "Months", value: Duration.MONTHS },
        { id: "8", label: "Years", value: Duration.YEARS },
      ])
    } else {
      setDurationOptions(durationOptionsData)
    }
  }, [shelfLife]);

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
        setCategoryOptions(id ? options.filter((el) => el.id != id) : options);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let response = await new BrandService().get();
        let options = response.map((brand: Brand) => {
          return {
            id: brand.id,
            label: brand.name,
            value: brand.name,
          };
        });
        setBrandOptions(id ? options.filter((el) => el.id != id) : options);
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
          let productWithId = await new ProductService().getById(id);
          if (productWithId) {
            setTitle(productWithId.title)
            setName(productWithId.name);
            setCategoryId({
              id: productWithId.category?.id,
              label: productWithId.category?.name,
              value: productWithId.category?.name,
            });
            setBrandId({
              id: productWithId.brand?.id,
              label: productWithId.brand?.name,
              value: productWithId.brand?.name,
            });
            setShortDescription(productWithId.shortDescription);
            setDescription(productWithId.description);
            setPrice(productWithId.price || 0);
            setWeight(productWithId.weight as any || 0);
            setUnit({ id: productWithId.unit, label: productWithId.unit, value: productWithId.unit });
            setExistingImages(productWithId.images || []);
            setFeatures(productWithId.features);
            if (productWithId.specs) {
              // productWithId.specs.forEach((spec) => {
              //   if (spec.label === Label.ORIGIN) setOrigin(spec.value as string);
              //   if (spec.label === Label.STORAGE)
              //     setStorage({
              //       id: spec.value,
              //       label: spec.value,
              //       value: spec.value,
              //     });
              //   if (spec.label === Label.SHELF_LIFE) {
              //     // Assuming format like "6 month" or handling string split
              //     const parts = (spec.value as string).split(" ");
              //     setShelfLife(parts[0] || "");
              //     if (parts[1])
              //       setShelfLifeDuration({
              //         id: parts[1],
              //         label: parts[1],
              //         value: parts[1],
              //       });
              //   }
              // });
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false)
        }
      }
    })()
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

  const isValid = () => {
    if (!title) {
      setTitleError('Please Provide Title')
    } else if (!name) {
      setNameError("Please Provide Name");
      // if (nameRef.current) {
      //   nameRef.current.scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'center'
      //   });
      //   nameRef.current.focus(); // Good for accessibility
      // }
    } else if (!categoryId) {
      setCategoryIdError("Please Select Category");
    } else if (!brandId) {
      setBrandIdError("Please Select Brand");
    } else if (!shortDescription) {
      setShortDescriptionError("Please Provide Short Description");
    } else if (!description) {
      setDescriptionError("Please Provide Description");
    } else if (!price || price == 0) {
      setPriceError("Please Provide Price");
    } else if (!origin) {
      setOriginError("Please Provide Origin");
    } else if (!weight || weight == 0) {
      setWeightError("Please Provide Weight");
    } else if (!unit) {
      setUnitError("Please Select Unit");
    } else if (!shelfLife) {
      setShelfLifeError("Please Provide Shelf Life");
    } else if (!shelfLifeDuration) {
      setShelfLifeDurationError("Please Select Duration")
    } else if (!storage?.id) {
      setStorageError("Please Select Storage");
    } else if (!features[0]) {
      setFeature1Error("Please Provide Feature");
    } else if (!features[1]) {
      setFeature2Error("Please Provide Feature");
    } else if (!features[2]) {
      setFeature3Error("Please Provide Feature");
    } else {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (nameError || categoryIdError || brandIdError || shortDescriptionError || descriptionError || priceError || originError || weightError || shelfLifeError || shelfLifeDurationError || storageError || feature1Error || feature2Error || feature3Error) {
      setError(true);
    } else {
      setError(false);
    }
  }, [nameError, categoryIdError, brandIdError, shortDescriptionError, descriptionError, priceError, originError, weightError, shelfLifeError, shelfLifeDurationError, storageError, feature1Error, feature2Error, feature3Error])
  // Submit
  const handleSubmit = async () => {
    if (isValid()) {
      setIsLoading(true);

      try {

        //   // Append existing images that weren't deleted
        //   formData.append('existingImages', JSON.stringify(existingImages));

        //   // Append new files
        //   newImageFiles.forEach(file => {
        //     formData.append('images', file);
        //   });


        let category = new Category();
        category.id = categoryId.id;

        let brand = new Brand();
        brand.id = brandId.id;

        let product = new Product();
        product.title = title;
        product.name = name;
        product.category = category;
        product.brand = brand;
        product.shortDescription = shortDescription;
        product.description = description;
        product.price = price;
        product.features = features;
        product.weight = weight.toString();
        product.unit = unit.value as Unit;
        // product.images - 
        product.specs = [{ label: Label.ORIGIN, value: origin }, { label: Label.STORAGE, value: storage.value as Storage }, { label: Label.SHELF_LIFE, value: { quantity: Number(shelfLife), unit: shelfLifeDuration.value as Duration } }]
        console.log('product', product);

        if (isEditMode) {
          await new ProductService().updateById(id, product);
        } else {
          await new ProductService().create(product);
        }
        navigate("/dashboard/products");
      } catch (err) {
        console.error(err);
        setErrors((prev) => ({ ...prev, submit: "Failed to save product." }));
      } finally {
        setIsLoading(false);
      }

    }
  };

  const OnChangeTitle = (title: string) => {
    if (title?.length > 60) {
      setTitleError("Only 60 characters allowed");
    } else {
      // add any regexs
      setTitle(title);
      setTitleError(null);
    }
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

  const OnChangeShortDescription = (shortDescription: string) => {
    if (shortDescription?.length > 60) {
      setShortDescriptionError("Only 60 characters allowed");
    } else {
      // add any regexs
      setShortDescription(shortDescription);
      setShortDescriptionError(null);
    }
  };

  const OnChangeDescription = (description: string) => {
    if (description?.length > 60) {
      setDescriptionError("Only 60 characters allowed");
    } else {
      // add any regexs
      setDescription(description);
      setDescriptionError(null);
    }
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

  const onChangeOrigin = (origin: string) => {
    if (origin?.length > 30) {
      setOriginError("Only 30 characters allowed");
    } else {
      // add any regexs
      setOrigin(origin);
      setOriginError(null);
    }
  };

  const onChangeWeight = (weight: number) => {
    if (weight < 0) {
      setWeightError("Please Provide Weight");
    } else {
      // add any regexs
      setWeight(weight);
      setWeightError(null);
    }
  };

  const onChangeShelfLife = (shelfLife: string) => {
    if (shelfLife?.length > 30) {
      setShelfLifeError("Only 30 characters allowed");
    } else {
      // add any regexs
      setShelfLife(shelfLife);
      setShelfLifeError(null);
    }
  };

  const onChangeFeaturesByIndex = (feature: string, index: number) => {
    if (feature?.length > 30) {
      let error = "Only 30 characters allowed";
      if (index == 0) {
        setFeature1Error(error)
      } else if (index == 1) {
        setFeature2Error(error)
      } else if (index == 2) {
        setFeature3Error(error)
      }
    } else {
      // add any regexs
      const nextValues = [...features];
      nextValues[index] = feature;
      setFeatures(nextValues);

      if (index == 0) {
        setFeature1Error(null)
      } else if (index == 1) {
        setFeature2Error(null)
      } else if (index == 2) {
        setFeature3Error(null)
      }
    }
  };

  const onSelectCategoryId = (val: any) => {
    setCategoryId(val);
    setCategoryIdError(null);
  }

  const onSelectBrandId = (val: any) => {
    setBrandId(val);
    setBrandIdError(null);
  }

  const onSelectUnit = (val: any) => {
    setUnit(val);
    setUnitError(null);
  }
  const onSelectShelfLifeDuration = (val: any) => {
    setShelfLifeDuration(val);
    setShelfLifeDurationError(null);
  }
  const onSelectStorage = (val: any) => {
    setStorage(val);
    setStorageError(null)
  }

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
                <h2>Product Details</h2>
              </div>

              <div className="create-product-card-body">
                <div className="create-product-field-group">
                  <label>
                    Title <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    placeholder="e.g. Premium Medjool Dates"
                    value={title}
                    onChange={(e: any) => OnChangeTitle(e)}
                    error={titleError ? true : false}
                    errorMessage={titleError}
                  // ref={titleRef}
                  />
                </div>
                <div className="create-product-field-group">
                  <label>
                    Name <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    placeholder="e.g. Premium Medjool Dates"
                    value={name}
                    onChange={(e: any) => OnChangeName(e)}
                    error={nameError ? true : false}
                    errorMessage={nameError}
                  // ref={nameRef}
                  />
                </div>

                <div className="create-product-row-split">
                  <div className="create-product-field-group">
                    <label>
                      Select Category <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={categoryOptions}
                      onSelect={(val: any) => onSelectCategoryId(val)}
                      label={categoryId ? categoryId.label : "Select category"}
                      error={categoryIdError ? true : false}
                      errorMessage={categoryIdError}
                    />
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Select Brand <span className="req">*</span>
                    </label>
                    <Dropdown
                      width="250px"
                      options={brandOptions}
                      onSelect={(val: any) => onSelectBrandId(val)}
                      label={brandId ? brandId.label : "Select brand"}
                      error={brandIdError ? true : false}
                      errorMessage={brandIdError}
                    />
                  </div>
                </div>

                <div className="create-product-field-group">
                  <label>
                    Short Description <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    placeholder="e.g. Pure Himalayan Wildflower Honey"
                    value={shortDescription}
                    onChange={(e: any) => OnChangeShortDescription(e)}
                    error={shortDescriptionError ? true : false}
                    errorMessage={shortDescriptionError}
                  />
                </div>

                <div className="create-product-field-group">
                  <label>
                    Full Description <span className="req">*</span>
                  </label>
                  <DashBoardInput
                    type='textarea'
                    // className={`create-product-textarea ${errors.description ? "error-border" : ""}`}
                    placeholder="Describe the origin, benefits, and unique qualities of the product..."
                    value={description}
                    onChange={(e) => OnChangeDescription(e)}
                    // rows={5}
                    error={descriptionError ? true : false}
                    errorMessage={descriptionError}
                  />
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
                        value={price?.toString()}
                        onChange={(e) => onChangePrice(Number(e))}
                        type="number"
                        error={priceError ? true : false}
                        errorMessage={priceError}
                      />
                    </div>
                  </div>

                  <div className="create-product-field-group">
                    <label>
                      Origin <span className="req">*</span>
                    </label>
                    <DashBoardInput
                      placeholder="e.g. Kashmir, India"
                      value={origin}
                      onChange={(e: any) => onChangeOrigin(e)}
                      error={originError ? true : false}
                      errorMessage={originError}
                    />
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
                          value={weight?.toString()}
                          onChange={(e) => onChangeWeight(Number(e))}
                          type="number"
                          error={weightError ? true : false}
                          errorMessage={weightError}
                        />
                      </div>
                      <div className="combined-right">
                        <Dropdown
                          options={unitOptions}
                          onSelect={(val: any) => onSelectUnit(val)}
                          label={unit?.label ? unit.label : "Select Unit"}
                          width="250px"
                          error={unitError ? true : false}
                          errorMessage={unitError}
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
                          onChange={(e) => onChangeShelfLife(e)}
                          type="number"
                          error={shelfLifeError ? true : false}
                          errorMessage={shelfLifeError}
                        />
                      </div>
                      <div className="combined-right">
                        <Dropdown
                          width="250px"
                          options={durationOptions}
                          onSelect={(val: any) => onSelectShelfLifeDuration(val)}
                          label={
                            shelfLifeDuration?.label
                              ? shelfLifeDuration.label
                              : "Select Duration"
                          }
                          error={shelfLifeDurationError ? true : false}
                          errorMessage={shelfLifeDurationError}
                        />
                      </div>
                    </div>
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
                      onSelect={(val: any) => onSelectStorage(val)}
                      label={
                        storage?.label
                          ? storage.label
                          : "Select storage condition"
                      }
                      error={storageError ? true : false}
                      errorMessage={storageError}
                    />
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Feature 1 <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        placeholder="about product"
                        value={features[0]}
                        onChange={(e: any) =>
                          onChangeFeaturesByIndex(e, 0)
                        }
                        error={feature1Error ? true : false}
                        errorMessage={feature1Error}
                      />
                    </div>
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Feature 2 <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        placeholder="about product"
                        value={features[1]}
                        onChange={(e: any) =>
                          onChangeFeaturesByIndex(e, 1)
                        }
                        error={feature2Error ? true : false}
                        errorMessage={feature2Error}
                      />
                    </div>
                  </div>
                  <div className="create-product-field-group">
                    <label>
                      Feature 3 <span className="req">*</span>
                    </label>
                    <div className="create-product-price-input">
                      <DashBoardInput
                        placeholder="about product"
                        value={features[2]}
                        onChange={(e: any) =>
                          onChangeFeaturesByIndex(e, 2)
                        }
                        error={feature3Error ? true : false}
                        errorMessage={feature3Error}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error &&
            <div className="create-product-error-overall">
              <div className="create-product-error-overall-info">
                <FaExclamationTriangle />
              </div>
              <div>
                <strong>Please Fill All Required Field</strong>
              </div>
            </div>
          }
          {/* Bottom Footer Action Bar */}
          <div className="create-product-footer-bar">
            <div className="create-product-bottom-actions">
              <DashBoardButton
                icon={<FiX size={25} />}
                width={'280px'}
                name="Cancel"
                variant="secondary"
                onClick={() => navigate("/dashboard/products")}
              />
              <DashBoardButton
                icon={<FiPlus size={25} />}
                width={'280px'}
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
