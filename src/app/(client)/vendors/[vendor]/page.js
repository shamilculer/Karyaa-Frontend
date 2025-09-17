import Image from "next/image";
import { vendors } from "@/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock10, Heart, MapPin, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import Link from "next/link";
import { Carousel } from "@/components/ui/carousel";
import { VendorsCard } from "../../components/common/VendorsList";
import VendorContact from "../../components/VendorContact";
import ScrollHeaderWrapper from "../../components/ScrollHeaderWrapper";
import VendorGallery from "../../components/VendorGallery";

const VendorPage = ({ params }) => {
    const { vendor } = params;

    return (
        <div className="min-h-screen">
            <ScrollHeaderWrapper vendorName={vendors[0].name} />
            <div className="container rounded-xl overflow-hidden">
                <VendorGallery />
            </div>

            <div className="container flex gap-12 !px-10">
                <div className="size-40 -translate-y-6">
                    <Avatar className="size-40 rounded-lg border-4 border-white">
                        <AvatarImage className="object-cover size-full " src={vendors[0].image} />
                        <AvatarFallback className="bg-white">VNR</AvatarFallback>
                    </Avatar>
                </div>

                <div className="w-full flex items-center">
                    <div className="w-full pr-10 relative">
                        <h1 className="leading-[1.334em]">{vendors[0].name}</h1>
                        <p className="uppercase !text-sm">{vendors[0].tagline}</p>
                        <div className="w-full flex items-center gap-7 mt-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                                <p className="ms-2 text-xs md:text-sm font-bold text-gray-900">{vendors[0].avgRating}/5</p>
                            </div>

                            <div className="flex-center gap-2">
                                <MapPin className="size-5" /> <span>Dubai, UAE</span>
                            </div>

                            <div className="flex-center gap-2">
                                <Clock10 className="size-5" /> <span>Open 24 Hours</span>
                            </div>
                        </div>


                        <div className="h-full absolute top-0 right-0 flex flex-col justify-between">
                            <div className="w-full flex items-center justify-end gap-3">
                                {/* Wishlist Button */}
                                <Button className="size-10 p-3 rounded-full border border-gray-500 bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary">
                                    <Heart className="size-5" />
                                </Button>

                                <Button className="size-10 p-3 rounded-full border border-gray-500 bg-white hover:bg-blue-700 hover:text-white flex items-center justify-center text-primary">
                                    <Share2 className="size-5" />
                                </Button>
                            </div>

                            <div>
                                <Link className="!font-semibold flex-center gap-1" href={`/compare?vendor=${vendors[0].slug}`}>Compare With Other Vendors<Plus className="size-5" /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <section className="container !mt-8 flex gap-16">
                <div className="w-[65%]">
                    <div id="vendor-nav" className="flex items-center gap-10 border-b border-[#636387]">
                        <Link href="#about" className="py-3 px-3 text-sm font-medium uppercase tracking-widest">About</Link>
                        <Link href="#services" className="py-3 px-3 text-sm font-medium uppercase tracking-widest">Services</Link>
                        <Link href="#reviews" className="py-3 px-3 text-sm font-medium uppercase tracking-widest">Reviews</Link>
                        <Link href="#packages" className="py-3 px-3 text-sm font-medium uppercase tracking-widest">Packages</Link>
                    </div>

                    <div className="space-y-12">
                        <div id="about" className="pt-12">
                            <h2 className="uppercase">About</h2>
                            <div className="mt-4">
                                <p>Elegant Event Decor is a full-service event design and décor company dedicated to transforming ordinary spaces into extraordinary experiences. With a passion for creativity and a keen eye for detail, the company specializes in curating stunning décor that reflects the unique personality and vision of each client. From weddings, receptions, and private celebrations to corporate gatherings, themed parties, and large-scale events, Elegant Event Decor ensures every occasion is elevated with style, sophistication, and flawless execution.</p><br />

                                <p>Their team of skilled designers blends timeless elegance with modern trends, offering customized solutions in floral arrangements, stage setups, lighting design, table styling, and venue transformations. Whether it’s creating a dreamy fairytale atmosphere or a sleek contemporary look, they focus on crafting immersive environments that leave lasting impressions on guests.</p><br />

                                <p>Backed by professionalism, quality materials, and a commitment to excellence, Elegant Event Decor has built a reputation for reliability and creativity. Every project is handled with personalized attention, ensuring clients enjoy not only a beautifully designed event but also a stress-free planning experience. For those who believe décor is more than just decoration—it’s storytelling, ambiance, and emotion—Elegant Event Decor is the perfect partner to bring visions to life.</p>
                            </div>
                        </div>

                        <div id="services">
                            <h2 className="uppercase">Services</h2>
                            <div className="mt-4 flex gap-5 flex-wrap">
                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Floral Decorations</span>

                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Theme-based Party Décor</span>

                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Ballon Decorations</span>

                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Lighting</span>

                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Wedding</span>

                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Photography</span>

                                <span className="leading-0 py-3 px-5 border border-gray-300 rounded-4xl text-sm uppercase text-[#191D23]">Catering</span>

                            </div>
                        </div>


                        <div id="reviews">
                            <div className="flex-between">
                                <h2 className="uppercase">Reviews</h2>
                                <Button variant="outline" className="rounded-lg p-4 hover:bg-secondary hover:text-white">Write a Review <Plus /></Button>
                            </div>

                            <div className="mt-4 w-full flex gap-14">
                                <div className="w-1/5 flex-center flex-col gap-3">
                                    <div className="text-5xl font-heading text-[#121217] font-medium">
                                        4.6<span className="text-2xl">/5</span>
                                    </div>

                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>                                <svg className="w-5 h-5 text-gray-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>
                                    </div>

                                    <div>155 Reviews</div>
                                </div>

                                <div className="w-4/5">
                                    <div className="w-96 space-y-3">
                                        <div className="w-full flex items-center gap-3">
                                            <span className="text-sm">1</span>
                                            <Progress value={35} />
                                            <span className="text-xs font-medium text-gray-500">42%</span>
                                        </div>

                                        <div className="w-full flex items-center gap-3">
                                            <span className="text-sm">2</span>
                                            <Progress value={20} />
                                            <span className="text-xs font-medium text-gray-500">20%</span>
                                        </div>

                                        <div className="w-full flex items-center gap-3">
                                            <span className="text-sm">3</span>
                                            <Progress value={18} />
                                            <span className="text-xs font-medium text-gray-500">18%</span>
                                        </div>

                                        <div className="w-full flex items-center gap-3">
                                            <span className="text-sm">7</span>
                                            <Progress value={5} />
                                            <span className="text-xs font-medium text-gray-500">7%</span>
                                        </div>

                                        <div className="w-full flex items-center gap-3">
                                            <span className="text-sm">5</span>
                                            <Progress value={3} />
                                            <span className="text-xs font-medium text-gray-500">3%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="w-full space-y-8">
                                    <div className="border border-gray-300 rounded-lg p-8">
                                        <div className="w-full flex items-center gap-5 pb-5 border-b border-gray-300">

                                            <Avatar className="size-16 rounded-full">
                                                <AvatarImage className="object-cover size-full " src={vendors[3].image} />
                                                <AvatarFallback className="bg-blue-200">AS</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h5 className="text-lg !font-medium">Ananya Sharma</h5>
                                                <span className="text-sm text-gray-500 px-2">11 MAR 2025</span>
                                            </div>
                                        </div>

                                        <div className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                    <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                </div>

                                                <span className="font-semibold">5/5</span>
                                            </div>

                                            <p className="mt-4 !text-sm">Elegant Event Decor completely transformed our wedding venue into a fairytale setting. From the floral arrangements to the lighting, every detail was handled with such creativity and care. The team was professional, attentive, and made the entire process stress-free. Our guests were blown away by how beautiful everything looked!</p>
                                        </div>
                                    </div>

                                    <div className="border border-gray-300 rounded-lg p-8">
                                        <div className="w-full flex items-center gap-5 pb-5 border-b border-gray-300">

                                            <Avatar className="size-16 rounded-full">
                                                <AvatarImage className="object-cover size-full " src={vendors[3].image} />
                                                <AvatarFallback className="bg-blue-200">YR</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h5 className="text-lg !font-medium">Yusuf Rahman</h5>
                                                <span className="text-sm text-gray-500 px-2">11 MAR 2025</span>
                                            </div>
                                        </div>

                                        <div className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>                                <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                    <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                </div>

                                                <span className="font-semibold">5/5</span>
                                            </div>

                                            <p className="mt-4 !text-sm">We hired Elegant Event Decor for our company’s annual gala, and they delivered beyond expectations. The décor perfectly reflected our brand while still creating a warm and elegant atmosphere. Their team was punctual, organized, and extremely easy to work with. Truly a five-star experience.</p>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="rounded-lg p-4 hover:bg-secondary hover:text-white">See More Reviews</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[35%]">
                    <VendorContact vendorName={vendors[0].name} />
                </div>
            </section>

            <div className="container my-10">
                <h2 className="uppercase">Packages</h2>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {/* Package 1 */}
                    <div className="rounded overflow-hidden">
                        <div className="relative">
                            <div className="h-52">
                                <Image
                                    fill
                                    src="/covers/cover-1.jpg"
                                    alt="package"
                                    className="w-full h-52 object-cover rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="w-full flex items-center flex-wrap gap-4 mt-4">
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Wedding</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Engagement</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Reception</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">+2</span>
                        </div>

                        <div className="mt-4 px-2 space-y-4">
                            <div className="flex items-center">
                                <div>
                                    <h3 className="!text-xl text-[#232536] !font-medium uppercase">Classic Wedding Package</h3>
                                    <span className="block text-xs uppercase">Elegant & Timeless</span>
                                </div>
                            </div>

                            <p className="line-clamp-3 !text-sm">
                                A beautifully curated wedding décor package featuring floral stage setups, aisle decorations, and lighting ambiance to create a warm and memorable experience.
                            </p>

                            <div className="w-full flex items-center gap-3">
                                <Button className="size-10 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary border border-primary">
                                    <Heart />
                                </Button>
                                <Button className="flex-1" asChild>
                                    <Link href={`/vendors/${vendors[0].slug}`}>Know More</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Package 2 */}
                    <div className="rounded overflow-hidden">
                        <div className="relative">
                            <div className="h-52">
                                <Image
                                    fill
                                    src="/covers/cover-2.jpg"
                                    alt="package"
                                    className="w-full h-52 object-cover rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="w-full flex items-center flex-wrap gap-4 mt-4">
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Corporate</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Gala Dinner</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">+3</span>
                        </div>

                        <div className="mt-4 px-2 space-y-4">
                            <div className="flex items-center">
                                <div>
                                    <h3 className="!text-xl text-[#232536] !font-medium uppercase">Corporate Elegance Package</h3>
                                    <span className="block text-xs uppercase">Professional & Stylish</span>
                                </div>
                            </div>

                            <p className="line-clamp-3 !text-sm uppercase">
                                Perfect for business events, this package includes branded stage décor, elegant table setups, and modern lighting solutions to create a professional atmosphere.
                            </p>

                            <div className="w-full flex items-center gap-3">
                                <Button className="size-10 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary border border-primary">
                                    <Heart />
                                </Button>
                                <Button className="flex-1" asChild>
                                    <Link href={`/vendors/${vendors[1].slug}`}>Know More</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Package 3 */}
                    <div className="rounded overflow-hidden">
                        <div className="relative">
                            <div className="h-52">
                                <Image
                                    fill
                                    src="/covers/cover-3.jpg"
                                    alt="package"
                                    className="w-full h-52 object-cover rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="w-full flex items-center flex-wrap gap-4 mt-4">
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Birthday</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Kids</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">Anniversary</span>
                            <span className="leading-0 bg-gray-100 font-heading uppercase text-xs text-[#4B5768] py-3 p-2 rounded-sm">+4</span>
                        </div>

                        <div className="mt-4 px-2 space-y-4">
                            <div className="flex items-center">
                                <div>
                                    <h3 className="!text-xl text-[#232536] !font-medium uppercase">Celebration Package</h3>
                                    <span className="block text-xs uppercase">Fun & Vibrant</span>
                                </div>
                            </div>

                            <p className="line-clamp-3 !text-sm">
                                Ideal for birthdays, anniversaries, and intimate gatherings, this package features colorful themes, balloon décor, and creative props to make your celebration unforgettable.
                            </p>

                            <div className="w-full flex items-center gap-3">
                                <Button className="size-10 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary border border-primary">
                                    <Heart />
                                </Button>
                                <Button className="flex-1" asChild>
                                    <Link href={`/vendors/${vendors[2].slug}`}>Know More</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <section className="container">
                <div className="relative">
                    <div className="flex justify-between items-center max-lg:items-end mb-6 md:mb-8">
                        <h2 className="uppercase">Similar Vendors</h2>
                        <Button asChild variant="outline" className="text-gray-700 font-medium text-base hover:underline">
                            <Link href="/vendors">View All</Link>
                        </Button>
                    </div>
                    <Carousel
                        spaceBetween={60}
                        slidesPerView={3}
                        autoplay
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 20 },
                            640: { slidesPerView: 2, spaceBetween: 40 },
                            1024: { slidesPerView: 3, spaceBetween: 50 },
                        }}
                        withPagination={false}
                        className="w-[93%] lg:w-full mx-auto max-lg:!pb-10"
                    >
                        {vendors.map((vendor) => (
                            <VendorsCard
                                key={vendor.slug}
                                vendor={vendor}
                            />
                        ))}
                    </Carousel>
                </div>
            </section>


        </div>
    );
};

export default VendorPage;