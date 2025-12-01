import { PermissionGuard } from "../components/common/PermissionGuard";

export default function CategoryManagementLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="categoryManagement">
            {children}
        </PermissionGuard>
    );
}
