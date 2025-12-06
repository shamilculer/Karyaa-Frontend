import AddPackageForm from "../../components/forms/AddPackageForm"

const AddPackagesPage = () => {
    return (
        <div className="dashboard-container flex items-center mt-10 flex-col space-y-8 mb-16">
            <div>
                <h3 className='!text-2xl uppercase !font-medium'>Create a New Package</h3>
            </div>

            <AddPackageForm />
        </div>
    )
}

export default AddPackagesPage 