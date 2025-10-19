import IdeasTable from "../../components/tables/IdeasTable"

const IdeasManagementPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest'>Idea Management</span>

            <IdeasTable />
        </div>
    )
}

export default IdeasManagementPage