import { PermissionGuard } from "../components/common/PermissionGuard";

export default function SupportTicketsLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="supportTickets">
            {children}
        </PermissionGuard>
    );
}
