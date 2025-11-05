import AdminLoginForm from "../../components/forms/admin/AdminLoginForm"

const AdminLoginPage = () => {
  return (
    <div className="h-screen w-screen bg-[url('/new-banner-9.jpg')] bg-center bg-cover flex-center relative">
        <div className="absolute top-0 left-0 backdrop-blur-md w-full h-full"></div>
        <AdminLoginForm />
    </div>
  )
}

export default AdminLoginPage