import BlogsTable from '../../components/tables/BlogsTable'

const BlogManagementPage = () => {
  return (
    <div className="h-full dashboard-container space-y-8">
        <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest'>Blog Management</span>
        <BlogsTable />
    </div>
  )
}

export default BlogManagementPage