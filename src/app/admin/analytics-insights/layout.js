import { PermissionGuard } from "../components/common/PermissionGuard";

export default function AnalyticsInsightsLayout({ children }) {
    return (
        <PermissionGuard requiredPermission="analyticsInsights">
            {children}
        </PermissionGuard>
    );
}
