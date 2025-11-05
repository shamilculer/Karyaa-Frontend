import TicketsTable from "../components/tables/TicketsTable"

const BlogManagementPage = () => {
  return (
    <div className="dashboard-container space-y-8 mb-14">
        <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest'>Support Tickets Management</span>
        <TicketsTable />
    </div>
  )
}

export default BlogManagementPage