import { PermissionGuard } from "../components/common/PermissionGuard";

export default function VendorManagementLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="vendorManagement">
            {children}
        </PermissionGuard>
    );
}
