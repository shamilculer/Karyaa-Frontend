"use client"

import { useState } from "react";
import { CreateAdminModal } from "../components/modals/admin/CreateAdminModal";
import AdminsTable from "../components/tables/AdminTable";

const AdminUsersPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="dashboard-container">
      <div className="flex-between items-center gap-20">
        <span className="text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest">
          Admin Users Management
        </span>

        <CreateAdminModal onSuccess={() => setRefreshKey(prev => prev + 1)} />
      </div>

      <AdminsTable key={refreshKey} />
    </div>
  );
};

export default AdminUsersPage;
