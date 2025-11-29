// Subcategory pages fetch server data and may rely on cookies; force dynamic rendering.


import CategoryList from "@/app/(client)/components/common/CategoriesList/CategoriesList";
import PageSearchBar from "@/app/(client)/components/common/PageSearchBar/PageSearchBar";
import PageTitle from "@/app/(client)/components/common/PageTitle";
import VendorsListWrapper from "@/app/(client)/components/common/vendorsList/VendorListWrapper";
import { getSubcategoryDetails } from "@/app/actions/public/categories";
import Image from "next/image";

const SubCategoryPage = async ({ params, searchParams }) => {
  let { subCategory } = await params;
  const filters = await searchParams || {};

  const subCategoryData = await getSubcategoryDetails(subCategory);


  return (
    <div>
      <PageTitle
        placement={`Subcategory: ${subCategoryData?.parentCategory?.name} > ${subCategoryData?.name}`}
        imgUrl={subCategoryData?.coverImage}
        title={subCategoryData?.name}
      />

      <section className="container !mb-16">
        <PageSearchBar />
      </section>

      <CategoryList />

      <section className="container !mt-0">
        <div className="relative">
          <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8 md:mb-16 xl:mb-8">
            <h2 className=" font-semibold uppercase">
              Featured Partners
            </h2>
          </div>
          <VendorsListWrapper showControls={true} isSubPage={true} filters={{ subCategory: subCategory, ...filters }} />
        </div>
      </section>

      <section className="container flex-center flex-col gap-8 !mb-16">
        <h2 className="texxt-center">
          Plan your perfect celebration with Karyaa
        </h2>

        <div className="max-w-7xl grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-20 items-baseline">
          <div className="flex-center flex-col gap-6">
            <Image
              width={310}
              height={210}
              src="/plan-banner-1.jpg"
              alt="Plan your event with karyaa"
            />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Discover your vibe</h4>
              <p className="text-[#6A6A6A]">
                We’ll help you find venues, décor, and experiences that match
                your personality.
              </p>
            </div>
          </div>

          <div className="flex-center flex-col gap-6">
            <Image
              width={310}
              height={210}
              src="/plan-banner-2.webp"
              alt="Plan your event with karyaa"
            />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Customize every detail</h4>
              <p className="text-[#6A6A6A]">
                From photographers to performers, explore a handpicked list of
                trusted vendors. Compare their portfolios, read reviews, and
                shortlist the ones that align with your vision.
              </p>
            </div>
          </div>

          <div className="flex-center flex-col gap-6">
            <Image
              width={310}
              height={210}
              src="/plan-banner-3.jpg"
              alt="Plan your event with karyaa"
            />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Connect with confidence</h4>
              <p className="text-[#6A6A6A]">
                Once you're ready, reach out directly to our vendor partners.
                Ask questions, check availability, and get quotes—Karyaa makes
                it smooth, simple, and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubCategoryPage;
