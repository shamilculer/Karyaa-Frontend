import BlogPosts from "../components/common/BlogPosts"
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar"

const BlogPage = async ({ searchParams }) => {

    return (
        <div className="min-h-screen">
            <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
                <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
                <div className="relative z-10 text-white text-center">
                    <h1 className="!text-white !text-5xl lg:!text-7xl">News & Updates</h1>
                    <p className="mt-2 max-md:text-xs">Ideas, Inspiration & Expert Tips for Every Event</p>
                </div>
            </section>

            <section className="container !mb-14">
                <PageSearchBar />
            </section>

            <section className="container divide-y divide-gray-300">
                <div className="w-full flex-between !items-end pb-5">
                    <div>
                        <h6 className="uppercase !font-medium">Editor's Pick</h6>
                        <h2 className="uppercase">Featured Articles</h2>
                    </div>
                </div>

                <div className="pt-5">
                    <BlogPosts searchParams={searchParams} />
                </div>
            </section>
        </div>
    )
}

export default BlogPage