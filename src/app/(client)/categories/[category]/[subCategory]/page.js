import PageSearchBar from "@/app/(client)/components/common/PageSearchBar/PageSearchBar";
import VendorsList from "@/app/(client)/components/common/VendorsList";
import { getSubcategoryDetails } from "@/app/actions/categories";

const SubCategoryPage = async ({ params, searchParams }) => {
  let { subCategory } = await params;
  const filters = await searchParams || {};

  const subCategoryData = await getSubcategoryDetails(subCategory);


  return (
    <div>
      <section
        className="!m-0 bg-cover bg-center h-72 md:h-96 flex-center relative px-4"
        style={{ backgroundImage: `url(${subCategoryData.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">
            {subCategoryData.name}
          </h1>
          {/* <p className="mt-2 max-md:text-xs">Explore our diverse range of categories</p> */}
        </div>
      </section>

      <section className="container !mb-16">
        <PageSearchBar />
      </section>

      <section className="container !mt-0">
        <div className="relative">
          <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8">
            <h2 className=" font-semibold uppercase">
              Featured Partners In {subCategoryData.name}
            </h2>
          </div>
          <VendorsList showControls={true} isSubPage={true} filters={{subCategory : subCategory, ...filters }} />
        </div>
      </section>
    </div>
  );
};

export default SubCategoryPage;
