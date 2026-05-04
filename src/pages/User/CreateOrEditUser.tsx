import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiX,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiInfo,
} from "react-icons/fi";

import DashBoardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../assets/dropdown/DropDown";
import "./CreateOrEditUser.css";
import { Profile } from "../../entity/profile";
import { Role } from "../../entity/role";
import { RoleService } from "../../service/role";

const CreateOrEditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [roleId, setRoleId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [roleOptions, setRoleOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const rolesRes = await new RoleService().get();
        setRoleOptions(
          rolesRes.map((r: Role) => ({
            id: r.id,
            label: r.name,
            value: r.name,
          })),
        );
      } catch (err) {
        console.error("Error fetching dependencies", err);
      }
    };
    fetchDependencies();

    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`/api/profiles/${id}`)
        .then((res) => {
          const profile: Profile = res.data;
          setName(profile.name || "");
          setEmail(profile.email || "");
          setMobile(profile.mobile || "");
          setRoleId({
            id: profile.role?.name,
            label: profile.role?.name,
            value: profile.role?.name,
          });
          setImagePreview(profile.profilePic || null);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "File exceeds 2MB limit",
        }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const generatePassword = () => {
    setPassword(Math.random().toString(36).slice(-8) + "A1!");
    setShowPassword(true);
  };

  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Required";
    if (!email.trim()) newErrors.email = "Required";
    if (!mobile.trim()) newErrors.mobile = "Required";
    if (!roleId) newErrors.roleId = "Required";
    if (!isEditMode && !password) newErrors.password = "Required for new users";
    if (!imagePreview && !imageFile)
      newErrors.profilePic = "Profile picture required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, submit: "Failed to save user access." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-management-user-container">
      {/* ── Header ── */}
      <div className="create-management-user-top-bar">
        {/* <div className="create-management-user-breadcrumbs">
          Users &rsaquo;{" "}
          <strong>{isEditMode ? "Edit User" : "Add New User"}</strong>
        </div> */}
        <button
          className="create-management-user-back-btn"
          onClick={() => navigate("/dashboard/users")}
        >
          <FiArrowLeft /> Back to Users
        </button>
        <h1 className="create-management-user-title">
          {isEditMode ? "Edit Access Credentials" : "Create a New Access"}
        </h1>
        <p className="create-management-user-subtitle">
          Create credentials for internal team members to manage the Nature
          Candy.
        </p>
      </div>

      <div className="create-management-user-card">
        {/* ── Avatar ── */}
        <div className="create-management-user-avatar-section">
          <div
            className={`create-management-user-avatar-wrapper ${errors.profilePic ? "error-border" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="create-management-user-avatar-img"
                />
                <button
                  className="create-management-user-avatar-remove"
                  onClick={removeImage}
                >
                  <FiX />
                </button>
              </>
            ) : (
              <div className="create-management-user-avatar-placeholder">
                <FiCamera className="create-management-user-avatar-icon" />
                <div className="create-management-user-avatar-edit-badge">
                  <FiCamera />
                </div>
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
          <div className="create-management-user-avatar-text">
            <strong>
              Profile Picture <span className="req">*</span>
            </strong>
            <p>JPG or PNG. Max 2MB.</p>
            {errors.profilePic && (
              <span className="create-management-user-error">
                {errors.profilePic}
              </span>
            )}
          </div>
        </div>

        {/*
          ── Form Grid ──
          Flat grid — no col wrapper divs.
          Section titles + fields are all direct grid children.
          Left and right cells share the same row → labels stay aligned.
        */}
        <div className="create-management-user-form-split">
          {/* Row 0 — titles */}
          <h3 className="create-management-user-section-title">
            PERSONAL INFORMATION
          </h3>
          <h3 className="create-management-user-section-title">
            ACCESS & SECURITY
          </h3>

          {/* Row 1 — Name | Role */}
          <div className="create-management-user-field">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <DashBoardInput
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(value) => setName(value)}
              error={!!errors.name}
              errorMessage={errors.name}
            />
          </div>

          <div className="create-management-user-field">
            <label>
              Account Role <span className="req">*</span>
            </label>
            <Dropdown
              options={roleOptions}
              label={roleId?.label || "Select Role"}
              onSelect={(val: any) => setRoleId(val)}
            />
            {errors.roleId && (
              <span className="create-management-user-error">
                {errors.roleId}
              </span>
            )}
          </div>

          {/* Row 2 — Email | Password */}
          <div className="create-management-user-field">
            <label>
              Email Address <span className="req">*</span>
            </label>
            <DashBoardInput
              placeholder="aarav@organicledger.com"
              value={email}
              onChange={(value) => setEmail(value)}
              type="email"
              error={!!errors.email}
              errorMessage={errors.email}
            />
          </div>

          <div className="create-management-user-field">
            <label>
              {isEditMode ? "Reset Password" : "Manual Password"}{" "}
              {!isEditMode && <span className="req">*</span>}
            </label>
            <div className="create-management-user-password-row">
              <div className="create-management-user-password-input">
                <DashBoardInput
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(value) => setPassword(value)}
                  icon={
                    showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />
                  }
                  onClickIcon={() => setShowPassword(!showPassword)}
                  error={!!errors.password}
                  errorMessage={errors.password}
                />
              </div>
              <button
                type="button"
                className="create-management-user-generate-btn"
                onClick={generatePassword}
              >
                Generate
              </button>
            </div>
            <span className="create-management-user-hint">
              Ensure the password contains at least 8 characters.
            </span>
          </div>

          {/* Row 3 — Phone | Status */}
          <div className="create-management-user-field">
            <label>
              Phone Number <span className="req">*</span>
            </label>
            <DashBoardInput
              placeholder="+91 98765 43210"
              value={mobile}
              onChange={(value) => setMobile(value)}
              error={!!errors.mobile}
              errorMessage={errors.mobile}
            />
          </div>

          <div className="create-management-user-field">
            <label>Account Status</label>
            <div className="create-management-user-status-toggle">
              <button
                type="button"
                className={`status-btn ${isActive ? "active" : ""}`}
                onClick={() => setIsActive(true)}
              >
                Active
              </button>
              <button
                type="button"
                className={`status-btn ${!isActive ? "inactive" : ""}`}
                onClick={() => setIsActive(false)}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        {/* <div className="create-management-user-footer"> */}
        {/* <div className="create-management-user-footer-info">
            <FiInfo className="info-icon" />
            <span>Account details will be saved to the ledger.</span>
          </div> */}
        <div className="create-management-user-footer-actions">
          <DashBoardButton
            name="Cancel"
            variant="secondary"
            onClick={() => navigate("/dashboard/users")}
          />
          <DashBoardButton
            name={isEditMode ? "Save Changes" : "Create User"}
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default CreateOrEditUser;
