import CategoryList from "../components/common/CategoriesList/CategoriesList"
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar"
import Image from "next/image"

const GalleryPage = () => {
    return (
        <div className="min-h-screen">
            <section className="!m-0 bg-[url('/new-banner-7.jpg')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
                <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
                <div className="relative z-10 text-white text-center">
                    <h1 className="!text-white !text-5xl lg:!text-7xl">Gallery</h1>
                </div>
            </section>

            <section className="container !mb-14">
                <PageSearchBar />
            </section>

            <section className="container">
                <CategoryList />
            </section>

            <section className="container flex-center flex-col gap-5">
                <h2 className="uppercase">A Visual Showcase</h2>

                <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">
                    <div
                        className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group hover:scale-105 transition-all duration-200"
                    >
                        <Image
                            src='/new-banner-5.jpg'
                            alt={"gallery"}
                            height={300}
                            width={300}
                            className="w-full h-72 object-cover rounded-xl"
                        />

                        <div className="absolute bottom-5 left-5 w-full z-10">
                            <h4 className="!text-white text-lg !font-medium">Vendor Name</h4>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent rounded-xl"></div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default GalleryPage