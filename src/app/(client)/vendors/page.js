import { Button } from "@/components/ui/button";
import PageSearchBar from "../components/common/PageSearchBar";
import VendorsList from "../components/common/VendorsList";
import { Earth, ListFilter } from "lucide-react";
import VendorSorter from "../components/VendorSorter";
import VendorFilterModal from "../components/VendorFilterModal";

const VendorsPage = () => {
  return (
    <div className="min-h-screen">
      <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Vendors</h1>
          <p className="mt-2 max-md:text-xs">
            Ideas, Inspiration & Expert Tips for Every Event
          </p>
        </div>
      </section>

      <section className="container !mb-14">
        <PageSearchBar />
      </section>

      <section className="container">
        <div className="relative">
          <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8">
            <h2 className=" font-semibold uppercase">Featured Partners</h2>
            <div className="flex-center gap-4">
              <Button className="bg-[#F2F4FF] border border-gray-300 text-primary hover:bg-gray-300 !px-6 ">
                <Earth />
                Map View
              </Button>

              <VendorFilterModal />

              <VendorSorter />

            </div>
          </div>

          <VendorsList />
        </div>
      </section>
    </div>
  );
};

export default VendorsPage;
