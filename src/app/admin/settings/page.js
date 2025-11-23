import { getAdminFromToken } from '../utils/getAdminFromToken'
import AdminSettingsClient from './AdminSettingsClient'

export const dynamic = 'force-dynamic'

const AdminSettingsPage = async () => {
    const { admin } = await getAdminFromToken();

    return <AdminSettingsClient admin={admin} />
}

export default AdminSettingsPage