import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiX,
  FiUploadCloud,
  FiBox,
  FiMapPin,
  FiLayers,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import Dropdown from "../../../../assets/dropdown/DropDown";
import "./CreateOrEditWareHouse.css";
import { ProfileService } from "../../../../service/profile";
import { Address, AddressType } from "../../../../entity/address";
import {
  CapacityUnit,
  Warehouse,
  WarehouseStatus,
  WarehouseType,
} from "../../../../entity/warehouse";
import {
  WarehouseBin,
} from "../../../../entity/warehouse_bin";
import { INDIAN_STATES } from "../../../../utils/utils";
import { Profile } from "../../../../entity/profile";
import { User } from "../../../../entity/user";
import { WarehouseBinService } from "../../../../service/warehouse_bin";
import { WarehouseService } from "../../../../service/warehouse";
import axios from "axios";
import Toast from "../../../../assets/toast/Toast";

// ─── Bin tree types (edit mode only) ─────────────────────────────────────────

interface BinLevel {
  id: string;
  levelCode: string;
  positions: number;
}

interface BinRack {
  id: string;
  rackCode: string;
  levels: BinLevel[];
}

interface BinAisle {
  id: string;
  aisleCode: string;
  racks: BinRack[];
  collapsed: boolean;
  maxUnits: Number
}

type ModalType = "aisle" | "rack" | "level" | null;

interface ModalState {
  type: ModalType;
  aisleId: string;
  rackId: string;
  racks: string;
  levels: string;
  positions: string;
  maxUnits: string;
  racksError: string;
  levelsError: string;
  positionsError: string;
  maxUnitsError: string;
}

// ─── Static options ───────────────────────────────────────────────────────────

const typeOptions = [
  { id: WarehouseType.OWN, label: WarehouseType.OWN, value: WarehouseType.OWN },
  { id: WarehouseType.RENTED, label: WarehouseType.RENTED, value: WarehouseType.RENTED },
];
const statusOptions = [
  { id: WarehouseStatus.ACTIVE, label: WarehouseStatus.ACTIVE, value: WarehouseStatus.ACTIVE },
  { id: WarehouseStatus.INACTIVE, label: WarehouseStatus.INACTIVE, value: WarehouseStatus.INACTIVE },
  { id: WarehouseStatus.MAINTENANCE, label: WarehouseStatus.MAINTENANCE, value: WarehouseStatus.MAINTENANCE },
];
const unitOptions = [
  { id: CapacityUnit.UNITS, label: "Units", value: CapacityUnit.UNITS },
];

const EMPTY_MODAL: ModalState = {
  type: null, aisleId: "", rackId: "",
  racks: "2", levels: "2", positions: "1", maxUnits: "200", // Defaulted positions to 1
  racksError: "", levelsError: "", positionsError: "", maxUnitsError: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nextCode(prefix: string, existing: string[]): string {
  const nums = existing
    .map((x) => parseInt(x.replace(prefix, ""), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return prefix + String(next).padStart(2, "0");
}

function calcTotalBins(aisles: BinAisle[]): number {
  return aisles.reduce(
    (sum, a) =>
      sum +
      a.racks.reduce(
        (s, r) => s + r.levels.reduce((ls, l) => ls + l.positions, 0),
        0
      ),
    0
  );
}

// ─── Deep Re-indexing Logic ───────────────────────────────────────────────────
// This function sweeps the entire tree and forces every Aisle, Rack, and Level
// to be perfectly sequential (e.g., L1, L2 become L1 when L1 is deleted)
function reindexTree(aisles: BinAisle[]): BinAisle[] {
  return aisles.map((a, aIndex) => {
    const newAisleCode = `A${String(aIndex + 1).padStart(2, "0")}`;

    const updatedRacks = a.racks.map((r, rIndex) => {
      const newRackCode = `R${String(rIndex + 1).padStart(2, "0")}`;

      const updatedLevels = r.levels.map((l, lIndex) => {
        const newLevelCode = `L${lIndex + 1}`;
        return {
          ...l,
          levelCode: newLevelCode,
          id: `${newRackCode}-${newLevelCode}` // Update Level ID based on new Rack Code
        };
      });

      return {
        ...r,
        rackCode: newRackCode,
        id: newRackCode,
        levels: updatedLevels
      };
    });

    return {
      ...a,
      aisleCode: newAisleCode,
      id: newAisleCode,
      racks: updatedRacks
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const CreateOrEditWareHouse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // General
  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<{ id: string; label: string; value: string }>({ id: "1", label: "tester", value: "tester" });
  const [type, setType] = useState<{ id: WarehouseType; label: WarehouseType; value: WarehouseType }>(null as any);
  const [status, setStatus] = useState<{ id: WarehouseStatus; label: WarehouseStatus; value: WarehouseStatus }>(null as any);

  // Address
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<{ id: string; label: string; value: string }>(null as any);
  const [pincode, setPincode] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");

  // Capacity
  const [totalCapacity, setTotalCapacity] = useState("");
  const [capacityUnit, setCapacityUnit] = useState<{ id: CapacityUnit; label: CapacityUnit; value: CapacityUnit }>(null as any);

  // Create-mode bin inputs
  const [aisle, setAisle] = useState<string>("");
  const [rack, setRack] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [maxUnits, setMaxUnits] = useState<string>("");

  // Edit-mode bin tree
  const [binAisles, setBinAisles] = useState<BinAisle[]>([]);
  const [modal, setModal] = useState<ModalState>(EMPTY_MODAL);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI
  const [isLoading, setIsLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<{ id: string; label: string; value: string }[]>([]);

  // Errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [userIdError, setUserIdError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [addressLine1Error, setAddressLine1Error] = useState<string>("");
  const [addressLine2Error, setAddressLine2Error] = useState<string>("");
  const [cityError, setCityError] = useState<string | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [totalCapacityError, setTotalCapacityError] = useState<string | null>(null);
  const [capacityUnitError, setCapacityUnitError] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState<string | null>(null);
  const [aisleError, setAisleError] = useState<string | null>(null);
  const [rackError, setRackError] = useState<string | null>(null);
  const [levelError, setLevelError] = useState<string | null>(null);
  const [maxUnitsError, setMaxUnitsError] = useState<string | null>(null);

  const stateOptions = INDIAN_STATES.map((s: string) => ({ id: s, label: s, value: s }));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string>(null);

  // ── Fetch profiles ──────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const profiles = await new ProfileService().getStaffs();
        setUserOptions(
          profiles.map((profile: Profile) => ({
            id: profile.id,
            label: profile.name,
            value: profile.name,
          }))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Fetch warehouse + bins in edit mode ─────────────────────────────────────

  useEffect(() => {
    (async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const warehouseResponse = await new WarehouseService().getWarehouseById(`/api/warehouses/${id}`);

          setAddressLine1(warehouseResponse.address?.line1 ?? "");
          setAddressLine2(warehouseResponse.address?.line2 ?? "");
          setCity(warehouseResponse.address?.city ?? "");
          setState(warehouseResponse.address?.state ? { id: warehouseResponse.address.state, label: warehouseResponse.address.state, value: warehouseResponse.address.state } : null as any);
          setMobile(warehouseResponse.address?.mobile ?? "");
          setName(warehouseResponse.name ?? "");
          setType(warehouseResponse.type ? { id: warehouseResponse.type, label: warehouseResponse.type, value: warehouseResponse.type } : null as any);
          setUserId(warehouseResponse.operator?.id ? { id: warehouseResponse.operator.id, label: warehouseResponse.operator.id, value: warehouseResponse.operator.id } : null as any);
          setStatus(warehouseResponse.status ? { id: warehouseResponse.status, label: warehouseResponse.status, value: warehouseResponse.status } : null as any);
          setTotalCapacity(warehouseResponse.totalCapacity?.toString() ?? "");
          setCapacityUnit(warehouseResponse.capacityUnit ? { id: warehouseResponse.capacityUnit, label: warehouseResponse.capacityUnit, value: warehouseResponse.capacityUnit } : null as any);

          const binResponse = await new WarehouseBinService().getWarehouseBinsByWareHouseId(`/api/warehousebins/${id}/warehouse`);
          setBinAisles(buildAisleTree(binResponse));
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [id, isEditMode]);

  // ── Build aisle → rack → level tree from flat bins array ───────────────────

  const buildAisleTree = (bins: any[]): BinAisle[] => {
    const aisleMap = new Map<string, BinAisle>();

    bins.forEach((bin) => {
      const aisleCode = bin.aisle ?? "";
      const rackCode = bin.rack ?? "";
      const levelCode = bin.level ?? "";
      const maxUnits = bin.maxUnits ?? "";

      if (!aisleMap.has(aisleCode)) {
        aisleMap.set(aisleCode, { id: aisleCode, aisleCode, racks: [], collapsed: false, maxUnits: maxUnits });
      }
      const aisleEntry = aisleMap.get(aisleCode)!;

      let rackEntry = aisleEntry.racks.find((r) => r.rackCode === rackCode);
      if (!rackEntry) {
        rackEntry = { id: rackCode, rackCode, levels: [] };
        aisleEntry.racks.push(rackEntry);
      }

      let levelEntry = rackEntry.levels.find((l) => l.levelCode === levelCode);
      if (!levelEntry) {
        levelEntry = { id: `${rackCode}-${levelCode}`, levelCode, positions: 0 };
        rackEntry.levels.push(levelEntry);
      }

      levelEntry.positions += 1;
    });

    return Array.from(aisleMap.values()).sort((a, b) => a.aisleCode.localeCompare(b.aisleCode));
  };


  // ── Auto-Reindexing Remove Handlers ──────────────────────────────────────────

  const handleRemoveAisle = (aisleId: string) => {
    setBinAisles((prev) => reindexTree(prev.filter((a) => a.id !== aisleId)));
  };

  const handleRemoveRack = (aisleId: string, rackId: string) => {
    setBinAisles((prev) =>
      reindexTree(
        prev.map((a) =>
          a.id === aisleId
            ? { ...a, racks: a.racks.filter((r) => r.id !== rackId) }
            : a
        )
      )
    );
  };

  const handleRemoveLevel = (aisleId: string, rackId: string, levelId: string) => {
    setBinAisles((prev) =>
      reindexTree(
        prev.map((a) =>
          a.id === aisleId
            ? {
              ...a,
              racks: a.racks.map((r) =>
                r.id === rackId
                  ? { ...r, levels: r.levels.filter((l) => l.id !== levelId) }
                  : r
              ),
            }
            : a
        )
      )
    );
  };

  /*
  // ── Position Add/Remove Handlers (Commented out for future use) ──────────────

  const handleAddPosition = (aisleId: string, rackId: string, levelId: string) => {
    setBinAisles((prev) =>
      prev.map((a) =>
        a.id === aisleId
          ? {
              ...a,
              racks: a.racks.map((r) =>
                r.id === rackId
                  ? {
                      ...r,
                      levels: r.levels.map((l) =>
                        l.id === levelId ? { ...l, positions: l.positions + 1 } : l
                      ),
                    }
                  : r
              ),
            }
          : a
      )
    );
  };

  const handleRemovePosition = (aisleId: string, rackId: string, levelId: string) => {
    setBinAisles((prev) =>
      prev.map((a) =>
        a.id === aisleId
          ? {
              ...a,
              racks: a.racks.map((r) =>
                r.id === rackId
                  ? {
                      ...r,
                      levels: r.levels.map((l) =>
                        l.id === levelId && l.positions > 1
                          ? { ...l, positions: l.positions - 1 }
                          : l
                      ),
                    }
                  : r
              ),
            }
          : a
      )
    );
  };
  */

  // ── Collapse toggle ──────────────────────────────────────────────────────────

  const toggleAisleCollapse = (aisleId: string) => {
    setBinAisles((prev) =>
      prev.map((a) => (a.id === aisleId ? { ...a, collapsed: !a.collapsed } : a))
    );
  };

  // ── Modal open helpers ────────────────────────────────────────────────────

  const openAddAisleModal = () => {
    setModal({ ...EMPTY_MODAL, type: "aisle" });
    setIsModalOpen(true);
  };

  const openAddRackModal = (aisleId: string) => {
    const aisleEntry = binAisles.find((a) => a.id === aisleId);
    const existingLevels = aisleEntry?.racks[0]?.levels.length.toString() ?? "2";
    setModal({ ...EMPTY_MODAL, type: "rack", aisleId, levels: existingLevels });
    setIsModalOpen(true);
  };

  const openAddLevelModal = (aisleId: string, rackId: string) => {
    setModal({ ...EMPTY_MODAL, type: "level", aisleId, rackId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModal(EMPTY_MODAL);
    setIsModalOpen(false);
  };

  // ── Bin preview count ────────────────────────────────────────────────────

  const getModalBinPreview = (): number => {
    const r = parseInt(modal.racks, 10) || 0;
    const l = parseInt(modal.levels, 10) || 0;
    const p = parseInt(modal.positions, 10) || 1; // Always 1
    const mu = parseInt(modal.maxUnits, 10) || 0; // Always 1
    if (modal.type === "aisle") return r * l * p;
    if (modal.type === "rack") return l * p;
    if (modal.type === "level") return p;
    if (modal.type === "maxUnits") return mu;
    return 0;
  };

  // ── Modal validation ──────────────────────────────────────────────────────

  const isModalValid = (): boolean => {
    let valid = true;
    const updated = { ...modal };
    if (modal.type === "aisle") {
      if (!modal.racks || parseInt(modal.racks) < 1) { updated.racksError = "Min 1 rack required"; valid = false; }
      if (!modal.levels || parseInt(modal.levels) < 1) { updated.levelsError = "Min 1 level required"; valid = false; }
    }
    if (modal.type === "rack") {
      if (!modal.levels || parseInt(modal.levels) < 1) { updated.levelsError = "Min 1 level required"; valid = false; }
    }
    // Validation for positions commented out, but kept logic default to pass
    if (!modal.positions || parseInt(modal.positions) < 1) { updated.positionsError = "Min 1 position required"; valid = false; }
    if (!modal.maxUnits || parseInt(modal.maxUnits) < 1) { updated.maxUnitsError = "Min 1 unit required"; valid = false; }
    if (!valid) setModal(updated);
    return valid;
  };

  const confirmModal = async () => {
    if (!isModalValid()) return;
    const r = parseInt(modal.racks, 10) || 1;
    const l = parseInt(modal.levels, 10) || 1;
    const p = parseInt(modal.positions, 10) || 1; // Forced to 1
    const mu = parseInt(modal.maxUnits, 10) || 200;

    try {
      if (modal.type === "aisle") {
        const nextAisleCode = nextCode("A", binAisles.map((a) => a.aisleCode));
        const newRacks: BinRack[] = Array.from({ length: r }, (_, ri) => {
          const rackCode = "R" + String(ri + 1).padStart(2, "0");
          return {
            id: rackCode, rackCode,
            levels: Array.from({ length: l }, (_, li) => ({
              id: `${rackCode}-L${li + 1}`, levelCode: `L${li + 1}`, positions: p,
            })),
          };
        });
        setBinAisles((prev) => [
          ...prev,
          { id: nextAisleCode, aisleCode: nextAisleCode, racks: newRacks, collapsed: false, maxUnits: mu },
        ]);
        // await axios.post(`/api/warehousebins/aisle`, { warehouseId: id, racks: r, levels: l, positions: p, maxUnitsPerBin: mu });

      } else if (modal.type === "rack") {
        const aisleEntry = binAisles.find((a) => a.id === modal.aisleId)!;
        const nextRackCode = nextCode("R", aisleEntry.racks.map((r) => r.rackCode));
        const newRack: BinRack = {
          id: nextRackCode, rackCode: nextRackCode,
          levels: Array.from({ length: l }, (_, li) => ({
            id: `${nextRackCode}-L${li + 1}`, levelCode: `L${li + 1}`, positions: p,
          })),
        };
        setBinAisles((prev) =>
          prev.map((a) => a.id === modal.aisleId ? { ...a, racks: [...a.racks, newRack], maxUnits: mu } : a)
        );
        // await axios.post(`/api/warehousebins/rack`, { warehouseId: id, aisle: modal.aisleId, levels: l, positions: p, maxUnitsPerBin: mu });

      } else if (modal.type === "level") {
        const aisleEntry = binAisles.find((a) => a.id === modal.aisleId)!;
        const rackEntry = aisleEntry.racks.find((r) => r.id === modal.rackId)!;
        const nextLvlCode = `L${rackEntry.levels.length + 1}`;
        const newLevel: BinLevel = { id: `${modal.rackId}-${nextLvlCode}`, levelCode: nextLvlCode, positions: p };
        setBinAisles((prev) =>
          prev.map((a) =>
            a.id === modal.aisleId
              ? { ...a, racks: a.racks.map((r) => r.id === modal.rackId ? { ...r, levels: [...r.levels, newLevel] } : r), maxUnits: mu }
              : a
          )
        );
        // await axios.post(`/api/warehousebins/level`, { warehouseId: id, aisle: modal.aisleId, rack: modal.rackId, positions: p, maxUnitsPerBin: mu });
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { setImagePreviewError("File size must be less than 2MB"); return; }
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

  const isValid = () => {
    if (!name) { setNameError("This is required"); return false; }
    if (!userId) { setUserIdError("This is required"); return false; }
    if (!type) { setTypeError("This is required"); return false; }
    if (!status) { setStatusError("This is required"); return false; }
    if (!addressLine1) { setAddressLine1Error("This is required"); return false; }
    if (!city) { setCityError("This is required"); return false; }
    if (!state) { setStateError("This is required"); return false; }
    if (!pincode) { setPincodeError("This is required"); return false; }
    if (!mobile) { setMobileError("This is required"); return false; }
    if (!totalCapacity) { setTotalCapacityError("This is required"); return false; }
    if (!capacityUnit) { setCapacityUnitError("This is required"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (isValid()) {
      setIsLoading(true);
      try {
        const addressData = new Address();
        addressData.line1 = addressLine1;
        addressData.line2 = addressLine2;
        addressData.city = city;
        addressData.state = state.label;
        addressData.country = "USA";
        addressData.type = AddressType.OFFICE;
        addressData.mobile = mobile;
        addressData.pincode = pincode;

        const warehouse = new Warehouse();
        warehouse.address = addressData;
        warehouse.operator = Object.assign(new User(), { id: userId.id });
        warehouse.name = name;
        warehouse.type = type.value;
        warehouse.status = status.value;
        warehouse.totalCapacity = Number(totalCapacity);
        warehouse.capacityUnit = capacityUnit.value;

        const warehouseBin = new WarehouseBin();
        warehouseBin.aisle = aisle;
        warehouseBin.rack = rack;
        warehouseBin.level = level;
        warehouseBin.maxUnits = Number(maxUnits);

        // Transform the nested UI binAisles tree back to the flat array layout
        let warehouseBins: WarehouseBin[] = [];
        binAisles.forEach((a) => {
          console.log(a, 'a')
          a.racks.forEach((r) => {
            r.levels.forEach((l) => {
              for (let p = 1; p <= l.positions; p++) {
                warehouseBins.push({
                  warehouse: warehouse,
                  binCode: `${a.aisleCode}-${r.rackCode}-${l.levelCode}-P${p}`,
                  aisle: a.aisleCode,
                  rack: r.rackCode,
                  level: l.levelCode,
                  position: `P${p}`,
                  maxUnits: Number(a.maxUnits) || 200,
                  isActive: true
                });
              }
            });
          });
        });

        if (isEditMode) {
          await new WarehouseService().updateWarehouseAndEssentialsById(id, warehouse, warehouseBin);
        } else {
          await new WarehouseService().createWarehouseAndEssentials(warehouse, warehouseBins);
        }
        navigate("/dashboard/warehouses");
      } catch (error: any) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
          console.log(error.response?.data)
          setToast(error.response?.data?.error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onChangeName = (v: string) => { if (v?.length > 60) { setNameError("Only 60 characters allowed"); } else { setName(v); setNameError(null); } };
  const onChangeAddressLine1 = (v: string) => { if (v?.length > 60) { setAddressLine1Error("Only 60 characters allowed"); } else { setAddressLine1(v); setAddressLine1Error(null); } };
  const onChangeAddressLine2 = (v: string) => { if (v?.length > 60) { setAddressLine2Error("Only 60 characters allowed"); } else { setAddressLine2(v); setAddressLine2Error(null); } };
  const onChangeCity = (v: string) => { if (v?.length > 30) { setCityError("Only 30 characters allowed"); } else { setCity(v); setCityError(null); } };
  const onChangePincode = (v: string) => { if (v?.length > 6) { setPincodeError("Only 6 digits allowed"); } else { setPincode(v); setPincodeError(null); } };
  const onChangeMobile = (v: string) => { if (v?.length > 10) { setMobileError("Only 10 digits allowed"); } else { setMobile(v); setMobileError(null); } };
  const onChangeTotalCapacity = (v: string) => { if (!v) { setTotalCapacityError("Please provide total capacity"); } else { setTotalCapacity(v); setTotalCapacityError(null); } };
  const onChangeAisle = (v: string) => { if (!v) { setAisleError("Please provide aisle count"); } else { setAisle(v); setAisleError(null); } };
  const onChangeRack = (v: string) => { if (!v) { setRackError("Please provide rack count"); } else { setRack(v); setRackError(null); } };
  const onChangeLevel = (v: string) => { if (!v) { setLevelError("Please provide level count"); } else { setLevel(v); setLevelError(null); } };
  const onChangeMaxUnits = (v: string) => { if (!v) { setMaxUnitsError("Please provide max units"); } else { setMaxUnits(v); setMaxUnitsError(null); } };
  const onChangeUserId = (v: { id: string; label: string; value: string }) => { if (!v) { setUserIdError("Please select manager"); } else { console.log(v); setUserId(v); setUserIdError(null); } };
  const onChangeType = (v: { id: WarehouseType; label: WarehouseType; value: WarehouseType }) => { if (!v) { setTypeError("Please select type"); } else { setType(v); setTypeError(null); } };
  const onChangeStatus = (v: { id: WarehouseStatus; label: WarehouseStatus; value: WarehouseStatus }) => { if (!v) { setStatusError("Please select status"); } else { setStatus(v); setStatusError(null); } };
  const onChangeState = (v: { id: string; label: string; value: string }) => { if (!v) { setStateError("Please select state"); } else { setState(v); setStateError(null); } };
  const onChangeCapacityUnit = (v: { id: CapacityUnit; label: CapacityUnit; value: CapacityUnit }) => { if (!v) { setCapacityUnitError("Please select capacity unit"); } else { setCapacityUnit(v); setCapacityUnitError(null); } };

  const getModalSubTitle = (): string => {
    if (modal.type === "aisle") return `Next aisle: ${nextCode("A", binAisles.map((a) => a.aisleCode))}`;
    if (modal.type === "rack") {
      const aisleEntry = binAisles.find((a) => a.id === modal.aisleId);
      return `Next rack: ${nextCode("R", aisleEntry?.racks.map((r) => r.rackCode) ?? [])}`;
    }
    if (modal.type === "level") {
      const aisleEntry = binAisles.find((a) => a.id === modal.aisleId);
      const rackEntry = aisleEntry?.racks.find((r) => r.id === modal.rackId);
      return `Next level: L${(rackEntry?.levels.length ?? 0) + 1}`;
    }
    return "";
  };

  return (
    <>
      {
        toast && (
          <Toast
            title={'WareHouse Creation Error'}
            description={toast}
            isError={true}
            duration={5000}
            onClose={() => setToast(null)}
          />
        )
      }
      <div className="create-warehouse-container">

        {/* Header */}
        <div className="create-warehouse-header-wrapper">
          <div className="create-warehouse-title-area">
            <button className="create-warehouse-back-btn" onClick={() => navigate("/dashboard/warehouses")}>
              <FiArrowLeft /> Back to Warehouses
            </button>
            <h1 className="create-warehouse-title">
              {isEditMode ? "Edit Warehouse" : "Add New Warehouse"}
            </h1>
            <p className="create-warehouse-subtitle">
              Configure storage locations and initial bin infrastructure.
            </p>
          </div>
        </div>

        <div className="create-warehouse-sections-wrapper">

          {/* ── Warehouse Details ──────────────────────────────────────────── */}
          <div className="create-warehouse-card">
            <div className="create-warehouse-card-header">
              <FiBox className="create-warehouse-header-icon" />
              <h2>Warehouse Details</h2>
            </div>
            <div className="create-warehouse-card-body">
              <div className="create-warehouse-field-group">
                <label>Warehouse Name <span className="req">*</span></label>
                <DashBoardInput placeholder="e.g. Central Hub Chennai" value={name} onChange={(e: any) => onChangeName(e)} error={nameError ? true : false} errorMessage={nameError} />
              </div>
              <div className="create-warehouse-row-split-dropdowns">
                <div className="create-warehouse-field-group">
                  <label>Warehouse Manager <span className="req">*</span></label>
                  <Dropdown options={userOptions} label={userId?.label || "Select User"} selected={userId} onSelect={(val: any) => onChangeUserId(val)} width="220px" error={userIdError ? true : false} errorMessage={userIdError} />
                </div>
                <div className="create-warehouse-field-group">
                  <label>Ownership Type <span className="req">*</span></label>
                  <Dropdown options={typeOptions} label={type?.label || "Select Ownership Type"} selected={type} onSelect={(val: any) => onChangeType(val)} width="230px" error={typeError ? true : false} errorMessage={typeError} />
                </div>
                <div className="create-warehouse-field-group">
                  <label>Operational Status <span className="req">*</span></label>
                  <Dropdown options={statusOptions} label={status?.label || "Select Operational Status"} selected={status} onSelect={(val: any) => onChangeStatus(val)} width="250px" error={statusError ? true : false} errorMessage={statusError} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Location & Capacity ────────────────────────────────────────── */}
          <div className="create-warehouse-card">
            <div className="create-warehouse-card-header">
              <FiMapPin className="create-warehouse-header-icon" />
              <h2>Location & Capacity</h2>
            </div>
            <div className="create-warehouse-card-body">
              <div className="create-warehouse-field-group">
                <label>Address Line 1 <span className="req">*</span></label>
                <DashBoardInput placeholder="Flat, House no., Building, Company, Apart" value={addressLine1} onChange={(e: any) => onChangeAddressLine1(e)} error={addressLine1Error ? true : false} errorMessage={addressLine1Error} />
                <div className="create-warehouse-field-group">
                  <label>Address Line 2</label>
                  <DashBoardInput placeholder="Area, Street, Sector, Village" value={addressLine2} onChange={(e: any) => onChangeAddressLine2(e)} error={addressLine2Error ? true : false} errorMessage={addressLine2Error} />
                </div>
                <div className="create-warehouse-row-three">
                  <div className="create-warehouse-field-group">
                    <label>City <span className="req">*</span></label>
                    <DashBoardInput placeholder="Town / City" value={city} onChange={(e: any) => onChangeCity(e)} error={cityError ? true : false} errorMessage={cityError} />
                  </div>
                  <div className="create-warehouse-field-group">
                    <label>State <span className="req">*</span></label>
                    <Dropdown options={stateOptions} label={state?.label || "Select State"} selected={state} onSelect={(val: any) => onChangeState(val)} error={stateError ? true : false} errorMessage={stateError} />
                  </div>
                  <div className="create-warehouse-field-group">
                    <label>Pincode <span className="req">*</span></label>
                    <DashBoardInput placeholder="6-digit Pincode" value={pincode} onChange={(e: any) => onChangePincode(e)} type="number" error={pincodeError ? true : false} errorMessage={pincodeError} />
                  </div>
                  <div className="create-warehouse-field-group">
                    <label>Mobile Number <span className="req">*</span></label>
                    <DashBoardInput placeholder="10-digit Mobile Number" value={mobile} onChange={(e: any) => onChangeMobile(e)} error={mobileError ? true : false} errorMessage={mobileError} />
                  </div>
                </div>
              </div>
              <div className="create-warehouse-row-address">
                <div className="create-warehouse-row-split-address">
                  <div className="create-warehouse-field-group">
                    <label>Total Capacity <span className="req">*</span></label>
                    <DashBoardInput placeholder="0" value={totalCapacity} onChange={(e: any) => onChangeTotalCapacity(e)} type="number" error={totalCapacityError ? true : false} errorMessage={totalCapacityError} />
                  </div>
                  <div className="create-warehouse-field-group">
                    <label>Capacity Unit <span className="req">*</span></label>
                    <Dropdown options={unitOptions} label={capacityUnit?.label || "Select Capacity Unit"} selected={capacityUnit} onSelect={(val: any) => onChangeCapacityUnit(val)} error={capacityUnitError ? true : false} errorMessage={capacityUnitError} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bin Infrastructure ──────────────────────────────────────────── */}
          <div className="create-warehouse-card">
            <div className="create-warehouse-card-header">
              <FiLayers className="create-warehouse-header-icon" />
              <h2>{isEditMode ? "Bin Infrastructure" : "Initial Bin Infrastructure"}</h2>
              <span className="bin-summary-badge">
                {binAisles.length} aisle{binAisles.length !== 1 ? "s" : ""} · {calcTotalBins(binAisles)} bins
              </span>
            </div>

            <div className="bin-edit-container">
              <div className="bin-edit-note">
                Manage your storage hierarchy. You can add or remove aisles, racks, and levels manually.
              </div>

              {binAisles.map((aisleEntry) => {
                const binCount = aisleEntry.racks.reduce(
                  (s, r) => s + r.levels.reduce((ls, l) => ls + l.positions, 0), 0
                );
                return (
                  <div key={aisleEntry.id} className="bin-aisle-block">

                    {/* Aisle header row */}
                    <div className="bin-aisle-header">
                      <div className="bin-aisle-header-left">
                        <span className="bin-aisle-name">{aisleEntry.aisleCode}</span>
                        <span className="bin-aisle-meta">
                          {aisleEntry.racks.length} rack{aisleEntry.racks.length !== 1 ? "s" : ""} · {binCount} bins
                        </span>
                      </div>
                      <div className="bin-aisle-header-right">
                        {/* Remove Aisle Button */}
                        <button className="bin-action-btn" style={{ color: '#dc3545' }} onClick={() => handleRemoveAisle(aisleEntry.id)}>
                          <FiX size={12} /> Remove aisle
                        </button>
                        <button className="bin-action-btn" onClick={() => openAddRackModal(aisleEntry.id)}>
                          <FiPlus size={12} /> Add rack
                        </button>
                        <button className="bin-collapse-btn" onClick={() => toggleAisleCollapse(aisleEntry.id)}>
                          {aisleEntry.collapsed ? <FiChevronDown size={13} /> : <FiChevronUp size={13} />}
                          {aisleEntry.collapsed ? "show" : "hide"}
                        </button>
                      </div>
                    </div>

                    {/* Rack rows */}
                    {!aisleEntry.collapsed && (
                      <>
                        <div className="bin-rack-col-header">
                          <span className="bin-col-rack">Rack</span>
                          <span className="bin-col-levels">Levels</span>
                          <span className="bin-col-action"></span>
                        </div>
                        {aisleEntry.racks.map((rackEntry) => (
                          <div key={rackEntry.id} className="bin-rack-row">
                            <span className="bin-col-rack">{rackEntry.rackCode}</span>
                            <div className="bin-col-levels">
                              <div className="bin-level-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {rackEntry.levels.map((lvl) => (
                                  <span key={lvl.id} className="bin-level-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {lvl.levelCode}

                                    {/* Commented out position UI for future use */}
                                    {/* · P1–P{lvl.positions} */}

                                    {/* Remove Level Button */}
                                    <button
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: '0', display: 'flex', alignItems: 'center' }}
                                      onClick={() => handleRemoveLevel(aisleEntry.id, rackEntry.id, lvl.id)}
                                      title="Remove Level"
                                    >
                                      <FiX size={14} />
                                    </button>

                                    {/* Add/Remove Position Buttons (Commented out) */}
                                    {/* <div style={{ display: 'flex', gap: '4px', marginLeft: '4px', borderLeft: '1px solid #ccc', paddingLeft: '6px' }}>
                                    <button onClick={() => handleAddPosition(aisleEntry.id, rackEntry.id, lvl.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#28a745', padding: '0', display: 'flex' }} title="Add Position"><FiPlus size={12}/></button>
                                    <button onClick={() => handleRemovePosition(aisleEntry.id, rackEntry.id, lvl.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: '0', display: 'flex' }} title="Remove Position"><FiX size={12}/></button>
                                  </div>
                                  */}

                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="bin-col-action" style={{ display: 'flex', gap: '8px' }}>
                              <button className="bin-add-level-btn" onClick={() => openAddLevelModal(aisleEntry.id, rackEntry.id)}>
                                <FiPlus size={11} /> level
                              </button>
                              {/* Remove Rack Button */}
                              <button className="bin-add-level-btn" style={{ color: '#dc3545', backgroundColor: 'transparent' }} onClick={() => handleRemoveRack(aisleEntry.id, rackEntry.id)}>
                                <FiX size={12} /> rack
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}

              <button className="bin-add-aisle-btn" onClick={openAddAisleModal}>
                <FiPlus size={14} /> Add new aisle
              </button>

              {/* Modal */}
              {isModalOpen && (
                <div className="bin-modal-overlay" onClick={closeModal}>
                  <div className="bin-modal" onClick={(e) => e.stopPropagation()}>

                    <div className="bin-modal-header">
                      <div>
                        <h3 className="bin-modal-title">
                          {modal.type === "aisle" && "Add new aisle"}
                          {modal.type === "rack" && `Add rack to ${modal.aisleId}`}
                          {modal.type === "level" && `Add level to ${modal.aisleId} / ${modal.rackId}`}
                        </h3>
                        <p className="bin-modal-sub">{getModalSubTitle()}</p>
                      </div>
                      <button className="bin-modal-close" onClick={closeModal}><FiX /></button>
                    </div>

                    <div className="bin-modal-body">
                      {modal.type === "aisle" && (
                        <div className="bin-modal-grid-2">
                          <div className="create-warehouse-field-group">
                            <label>Racks <span className="req">*</span></label>
                            <DashBoardInput type="number" placeholder="e.g. 2" value={modal.racks} onChange={(v: string) => setModal((m) => ({ ...m, racks: v, racksError: "" }))} error={!!modal.racksError} errorMessage={modal.racksError} />
                          </div>
                          <div className="create-warehouse-field-group">
                            <label>Levels <span className="req">*</span></label>
                            <DashBoardInput type="number" placeholder="e.g. 2" value={modal.levels} onChange={(v: string) => setModal((m) => ({ ...m, levels: v, levelsError: "" }))} error={!!modal.levelsError} errorMessage={modal.levelsError} />
                          </div>
                        </div>
                      )}
                      {modal.type === "rack" && (
                        <div className="create-warehouse-field-group">
                          <label>Levels <span className="req">*</span></label>
                          <DashBoardInput type="number" placeholder="e.g. 2" value={modal.levels} onChange={(v: string) => setModal((m) => ({ ...m, levels: v, levelsError: "" }))} error={!!modal.levelsError} errorMessage={modal.levelsError} />
                        </div>
                      )}
                      <div className="bin-modal-grid-2 bin-modal-grid-gap">

                        {/* Positions input commented out for future use */}
                        {/* <div className="create-warehouse-field-group">
                        <label>Positions / level <span className="req">*</span></label>
                        <DashBoardInput type="number" placeholder="e.g. 4" value={modal.positions} onChange={(v: string) => setModal((m) => ({ ...m, positions: v, positionsError: "" }))} error={!!modal.positionsError} errorMessage={modal.positionsError} />
                      </div> 
                      */}

                        <div className="create-warehouse-field-group">
                          <label>Max units / bin</label>
                          <DashBoardInput type="number" placeholder="200" value={modal.maxUnits} onChange={(v: string) => setModal((m) => ({ ...m, maxUnits: v, maxUnitsError: "" }))} error={!!modal.maxUnitsError} errorMessage={modal.maxUnitsError} />
                        </div>
                      </div>

                      {getModalBinPreview() > 0 && (
                        <div className="bin-modal-preview">
                          This will generate <strong>{getModalBinPreview()} new bin{getModalBinPreview() !== 1 ? "s" : ""}</strong>
                        </div>
                      )}
                    </div>

                    <div className="bin-modal-footer">
                      <DashBoardButton name="Cancel" variant="secondary" onClick={closeModal} />
                      <DashBoardButton name="Add" variant="primary" onClick={confirmModal} disabled={isLoading} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Facility Image ────────────────────────────────────────────── */}
          <div className="create-warehouse-card">
            <div className="create-warehouse-card-header">
              <FiUploadCloud className="create-warehouse-header-icon" />
              <h2>Facility Image</h2>
            </div>
            <div className="create-warehouse-card-body">
              <div
                className={`create-warehouse-upload-area ${imagePreviewError ? "error-border" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="create-warehouse-preview-wrapper">
                    <img src={imagePreview} alt="Facility Preview" />
                    <button className="create-warehouse-remove-img" onClick={removeImage}><FiX /></button>
                  </div>
                ) : (
                  <div className="create-warehouse-upload-placeholder">
                    <div className="create-warehouse-upload-icon-wrapper">
                      <FiUploadCloud className="create-warehouse-upload-icon" />
                    </div>
                    <span className="create-warehouse-upload-title">Click to upload warehouse photo</span>
                    <span className="create-warehouse-upload-subtitle">JPG or PNG up to 2MB</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
              </div>
              {imagePreviewError && <span className="create-warehouse-error">{imagePreviewError}</span>}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="create-warehouse-footer">
          <DashBoardButton name="Cancel" variant="secondary" onClick={() => navigate("/dashboard/warehouses")} />
          <DashBoardButton name={isEditMode ? "Save Changes" : "Create Warehouse"} variant="primary" onClick={handleSubmit} disabled={isLoading} />
        </div>

      </div>
    </>
  );
};

export default CreateOrEditWareHouse;