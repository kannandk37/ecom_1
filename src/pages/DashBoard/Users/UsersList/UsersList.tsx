
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./UsersList.css";
import IMAGE from "../../../../../data/DRY_FRUITS.png";
import Table, { ActionCallbacks, Badge, IconText, PaginationData, TableColumn } from "../../../../assets/table/Table";
import Loader2 from "../../../../assets/loader/Loader2";
import StatisticCard from "../../../../assets/ui/StatisticCard/StatisticCard";
import DashBoardInput from "../../../../assets/ui/DashBoardInput/DashBoardInput";
import DashBoardButton from "../../../../assets/ui/DashBoardButton/DashBoardButton";
import { ProfileService } from "../../../../service/profile";
import { RoleName } from "../../../../entity/role";
import { FaUserPlus, FaUsers, FaUserTie } from "react-icons/fa";
import Dropdown from "../../../../assets/dropdown/DropDown";

interface UserData {
  id: string;
  slNo: string;
  profilePic: any;
  profile: string;
  profileRole: { name: string, style: any };
  status: string;
  disableEdit?: boolean;
  disableDelete?: boolean;
}

const usersColumns: TableColumn<UserData>[] = [
  { key: "slNo", label: "SL. NO", width: "6.5%", align: "center" },
  {
    key: "profilePic",
    label: "PROFILE",
    width: "15%",
    align: "center",
    renderCell: (value) => <IconText imageStyle={{borderRadius: '20px', width: '40px', height: '40px'}} image={value} />,
  },
  {
    key: "profile",
    label: "CONTACT",
    width: "15.875%",
    align: "center",
    renderCell: (value) => <IconText text={value} />,
  },
  {
    key: "profileRole",
    label: "ROLE",
    width: "15.875%",
    align: "center",
    renderCell: (value) => <Badge style={value.style} text={value.name} />,
  },
  {
    key: "status",
    label: "STATUS",
    width: "15.875%",
    align: "center",
    renderCell: (value) => <IconText text={value} />,
  },
  { key: "actions", label: "ACTIONS", width: "15%", align: "center" },
];

const roleColors: { role: RoleName, style: React.CSSProperties }[] = [
  {
    role: RoleName.SUPERADMIN,
    style: { background: 'var(--color-primary)', color: 'var(--color-text-primary' }
  },
  {
    role: RoleName.ADMIN,
    style: { background: 'var(--admin-role)', color: 'var(--admin-role-font)' }
  },
  {
    role: RoleName.CUSTOMER,
    style: { background: 'var(--customer-role)', color: 'var(--customer-role-font)' }
  }
]

const PER_PAGE = 5;

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [rawUsersData, setRawUsersData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const navigate = useNavigate();
  const [roleOptions, setRoleOptions] = useState<
    { id: string; label: string; value: string }[]
  >([
    { id: RoleName.CUSTOMER, label: RoleName.CUSTOMER, value: RoleName.CUSTOMER },
    { id: 'staffs', label: 'staffs', value: 'staffs' }
  ]);
  const [roleId, setRoleId] = useState<{
    id: string;
    label: string;
    value: string;
  }>({ id: 'staffs', label: 'staffs', value: 'staffs' });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const responseData = await new ProfileService().getStaffs();
        let mapped: UserData[] = [];
        if (responseData?.length > 0) {
          let index = 0;
          for (const response of responseData) {
            mapped.push({
              id: response.id,
              slNo: `${index + 1}`,
              profilePic: IMAGE,
              profile: response.name,
              profileRole: { name: response.role.name, style: roleColors.find((roleColor) => roleColor.role == response.role.name)?.style },
              status: response.isEmailVerified ? 'Verified' : 'Not Verified',
              disableEdit: response.role.name == RoleName.CUSTOMER ? true : false,
              disableDelete: response.role.name == RoleName.CUSTOMER ? true : false,
            });
            index++;
          }
          setUsersCount(index);
        }
        setRawUsersData(mapped);
      } catch (err) {
        console.error("Failed to load profiles", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (roleId?.id && rawUsersData?.length > 0) {
      let roleBasedData = rawUsersData?.filter((userData: UserData) =>
        roleId.value === RoleName.CUSTOMER
          ? userData.profileRole.name === RoleName.CUSTOMER
          : (userData.profileRole.name === RoleName.ADMIN || userData.profileRole.name === RoleName.SUPERADMIN)
      );
      setFilteredData(roleBasedData);
    }
  }, [roleId, rawUsersData]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const result = rawUsersData.filter(
        (el) =>
          (el.slNo?.toLowerCase().includes(query) ||
            el.profile?.toLowerCase().includes(query) ||
            el.profileRole.name?.toLowerCase().includes(query)
          )
          &&
          (
            roleId.value === RoleName.CUSTOMER
              ? el.profileRole.name === RoleName.CUSTOMER
              : (el.profileRole.name === RoleName.ADMIN || el.profileRole.name === RoleName.SUPERADMIN)
          )
      );
      setFilteredData(result);
    }
    setCurrentPage(1);
  }, [searchQuery, rawUsersData]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / PER_PAGE);

  const pagedData = filteredData.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pagination: PaginationData = {
    currentPage,
    totalEntries,
    perPage: PER_PAGE,
    onPageChange: handlePageChange,
  };

  const usersActions: ActionCallbacks = {
    onEdit: (id) => navigate(`/dashboard/users/edit/${id}`),
    // onDelete: (id) => console.log(`Delete user ${id}`),
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="users-list-admin-page-container">
          <div className="users-list-admin-page-header">
            <h1 className="users-list-admin-page-title">Users Management</h1>
            <p className="users-list-admin-page-subtitle">
              View, Search, And Manage Your Users.
            </p>
          </div>

          <div className="users-list-statistic-card">
            <StatisticCard
              title="Total Staffs"
              value={usersCount}
              icon={<FaUserTie />}
              showBackground={true}
            />
            <StatisticCard
              title="Total Customers"
              value={customersCount}
              icon={<FaUsers />}
              showBackground={true}
            />
          </div>

          <div className="users-list-table-actions-header">
            <div className="users-list-search-bar-wrapper">
              <DashBoardInput
                placeholder="Search Users..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e)}
                icon={<FiSearch />}
                showBorder={true}
              />
              <Dropdown
                options={roleOptions}
                label={roleId?.label || "Select Role"}
                onSelect={(val: any) => { setRoleId(val); setSearchQuery(''); }}
                selected={roleId}
                width={'260px'}
                showClose={false}
              />
            </div>
            <div className="users-list-action-btn-wrapper">
              <DashBoardButton
                icon={<FaUserPlus size={25} />}
                name="Add User"
                variant="primary"
                onClick={() => navigate("/dashboard/users/add")}
              />
            </div>
          </div>

          <Table<UserData>
            width="100%"
            columns={usersColumns}
            data={pagedData}
            actions={usersActions}
            pagination={pagination}
            idField="id"
            isSearch={searchQuery}
          />
        </div>
      )}
    </>
  );
};

export default UsersList;
