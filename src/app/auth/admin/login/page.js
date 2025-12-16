import AdminLoginForm from "../../components/forms/admin/AdminLoginForm"

export const metadata = {
  title: "Admin Login | Karyaa",
  description: "Secure access for Karyaa administrators.",
};

const AdminLoginPage = () => {
  return (
    <div className="h-[100dvh] w-screen bg-[url('/new-banner-9.jpg')] bg-center bg-cover flex-center relative">
      <div className="absolute top-0 left-0 backdrop-blur-md w-full h-full"></div>
      <AdminLoginForm />
    </div>
  )
}

export default AdminLoginPage