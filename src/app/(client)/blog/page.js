// Blog listing may call server helpers that use cookies; prevent static prerender errors by forcing dynamic.
export const dynamic = "force-dynamic";

import BlogPosts from "../components/common/BlogPosts";
import CategoryList from "../components/common/CategoriesList/CategoriesList";
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import PageTitle from "../components/common/PageTitle";

const BlogPage = async ({ searchParams }) => {
  return (
    <div className="min-h-screen">
      <PageTitle
        imgUrl="/banner-1.avif"
        title="News & Updates"
        tagline="Ideas, Inspiration & Expert Tips for Every Event"
        placement="Blog Page"
      />

      <section className="container !mb-14">
        <PageSearchBar />
      </section>

      <CategoryList />

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
  );
};

export default BlogPage;
