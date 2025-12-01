import { PermissionGuard } from "../components/common/PermissionGuard";

export default function ReferralsManagementLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="referralManagement">
            {children}
        </PermissionGuard>
    );
}
