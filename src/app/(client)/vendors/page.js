// Vendors page relies on server-side helpers (auth, saved vendors) that use cookies; make dynamic.
export const dynamic = 'force-dynamic';

import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import PageTitle from "../components/common/PageTitle";
import VendorsListWrapper from "../components/common/vendorsList/VendorListWrapper";

const VendorsPage = async ({ searchParams }) => {

  const filters = await searchParams;
  return (
    <div className="min-h-screen">
      <PageTitle imgUrl="/banner-1.avif" title="Vendors" />

      <section className="container !mb-14">
        <PageSearchBar />
      </section>

      <section className="container">
        <div className="relative">
          <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8">
            <h2 className=" font-semibold uppercase">Featured Partners</h2>
          </div>

          <VendorsListWrapper showControls={true} filters={filters} />
        </div>
      </section>
    </div>
  );
};

export default VendorsPage;
