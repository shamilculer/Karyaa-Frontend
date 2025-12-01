import { PermissionGuard } from "../components/common/PermissionGuard";

export default function ReviewManagementLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="reviewManagement">
            {children}
        </PermissionGuard>
    );
}
