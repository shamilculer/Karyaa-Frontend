import { PermissionGuard } from "../components/common/PermissionGuard";

export default function LeadsManagementLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="leadsManagement">
            {children}
        </PermissionGuard>
    );
}
