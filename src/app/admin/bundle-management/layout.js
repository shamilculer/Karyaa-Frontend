import { PermissionGuard } from "../components/common/PermissionGuard";

export default function BundleManagementLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="bundleManagement">
            {children}
        </PermissionGuard>
    );
}
