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
  FiPlus,
} from "react-icons/fi";

import DashBoardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../assets/dropdown/DropDown";
import "./CreateOrEditUser.css";
import { Profile } from "../../entity/profile";
import { Role } from "../../entity/role";
import { RoleService } from "../../service/role";
import Loader2 from "../../assets/loader/Loader2";
import { User } from "../../entity/user";
import { AccountStatus, UserAccount } from "../../entity/user_account";
import { UserService } from "../../service/user";

const CreateOrEditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [roleId, setRoleId] = useState<{
    id: string;
    label: string;
    value: string;
  }>(null);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");
  const [imagePreviewError, setImagePreviewError] = useState<string>('');
  const [roleIdError, setRoleIdError] = useState<string>('') //Please Select Role
  const [passwordError, setPasswordError] = useState<string>("");
  const [roleOptions, setRoleOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
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
    })()
  }, [])

  useEffect(() => {


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
        setImagePreviewError('File exceeds 2MB limit');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImagePreviewError(null);
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

  const isValid = () => {
    if (!name.trim()) {
      setNameError("Please Provide Name");
    } else if (!roleId) {
      setRoleIdError("Please Select Role");
    } else if (!email) {
      setEmailError("Please Provide Email");
    } else if (!mobile) {
      setMobileError("Please Provide Mobile Number");
    } else if (!password) {
      setPasswordError("Please Provide Password");
    } else {
      return true;
    }
    return false;
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isValid()) {
      let user = new User();
      let role = new Role();
      role.id = roleId.id;
      user.roles = [role];
      let profile = new Profile();
      profile.name = name;
      profile.email = email;
      profile.mobile = mobile;
      profile.role = role;
      profile.user = user;
      let userAccount = new UserAccount();
      userAccount.email = email;
      userAccount.password = password;
      userAccount.user = user;
      userAccount.status = isActive ? AccountStatus.ACTIVE : AccountStatus.INACTIVE
      try {
        if (isEditMode) {
          await new UserService().updateById(id, user, role, profile, userAccount);
        } else {
          await new UserService().create(user, role, profile, userAccount);
        }
        navigate("/dashboard/users");
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
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

  const OnChangeEmail = (email: string) => {
    if (email?.length > 60) {
      setEmailError("Only 60 characters allowed");
    } else {
      // add any regexs
      setEmail(email);
      setEmailError(null);
    }
  };


  const OnChangePassword = (password: string) => {
    if (password?.length > 60) {
      setPasswordError("Only 60 characters allowed");
    } else {
      // add any regexs
      setPassword(password);
      setPasswordError(null);
    }
  };


  const OnChangemobile = (mobile: string) => {
    if (mobile?.length > 10) {
      setMobileError("Please Provide Valid Mobile Number");
    } else {
      // add any regexs
      setMobile(mobile);
      setMobileError(null);
    }
  };

  return (
    <>
      {isLoading ?
        (
          <Loader2 />
        ) : (
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
                  className={`create-management-user-avatar-wrapper ${imagePreviewError ? "error-border" : ""}`}
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
                  {imagePreviewError && (
                    <span className="create-management-user-error">
                      {imagePreviewError}
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
                    onChange={OnChangeName}
                    error={nameError ? true : false}
                    errorMessage={nameError}
                  />
                </div>

                <div className="create-management-user-field">
                  <label>
                    Account Role <span className="req">*</span>
                  </label>
                  <Dropdown
                    options={roleOptions}
                    label={roleId?.label || "Select Role"}
                    onSelect={(val: any) => { setRoleId(val); console.log(val) }}
                    error={roleIdError ? true : false}
                    errorMessage={roleIdError}
                  />
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
                    error={emailError ? true : false}
                    errorMessage={emailError}
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
                        error={passwordError ? true : false}
                        errorMessage={passwordError}
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
                    error={mobileError ? true : false}
                    errorMessage={mobileError}
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
                  icon={<FiX size={25} />}
                  name="Cancel"
                  variant="secondary"
                  onClick={() => navigate("/dashboard/users")}
                  width={"250px"}
                />
                <DashBoardButton
                  icon={<FiPlus size={25} />}
                  name={isEditMode ? "Save Changes" : "Create User"}
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  width={"250px"}
                />
              </div>
              {/* </div> */}
            </div>
          </div>
        )
      }
    </>
  );
};

export default CreateOrEditUser;
