import { PermissionGuard } from "../components/common/PermissionGuard";

export default function CareersLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="careersManagement">
            {children}
        </PermissionGuard>
    );
}
