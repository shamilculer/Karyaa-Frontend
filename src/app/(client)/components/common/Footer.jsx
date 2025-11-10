"use client";

import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useClientStore } from "@/store/clientStore"
import { getBrandDetailsAction } from "@/app/actions/brand";
import { useEffect, useState } from "react";
import ReferModal from "../ReferModal";

const Footer = () => {
  // Get user from your store
  const user = useClientStore((state) => state.user);
  const isLoggedIn = !!user;

  const [contactDetails, setContactDetails] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const details = await getBrandDetailsAction()
      setContactDetails(details?.data)
    }

    fetchData()
  }, [])

  const aboutKaryaaLink = [
    {
      text: "Categories",
      href: "/categories"
    },
    {
      text: "Contact Us",
      href: "/contact"
    },
    {
      text: "Blog",
      href: "/blog"
    },
    {
      text: "Ideas",
      href: "/ideas"
    },
  ]

  const karyaacare = [
    {
      text: "Terms and Condition",
      href: "/terms-and-condition"
    },
    {
      text: "Privacy Policy",
      href: "/privacy-policy"
    },
    {
      text: "Compare a Vendor",
      href: "/compare"
    },
  ]

  return (
    <footer className={`w-full py-5 px-4 bg-[#f5f5f5] flex-center flex-col ${!isLoggedIn ? "mt-32 lg:mt-36" : "mt-20 lg:mt-16"}`}>
      {/* Only show CTA section if user is NOT logged in */}
      {!isLoggedIn && (
        <section className="container !m-0 !p-0 !-mt-20 bg-white flex flex-col lg:flex-row items-center gap-0 h-auto lg:h-72 rounded-xl border border-gray-200 overflow-hidden max-lg:gap-8">
          <div className="h-60 lg:h-full w-full lg:w-1/2 bg-[url('/cta-1.webp')] bg-cover lg:bg-[length:120%] bg-center lg:bg-top rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none flex items-center justify-center relative overflow-hidden clippath-left">
            <div className="absolute inset-0 bg-black/40 w-full h-full"></div>
            <div className="flex-center flex-col text-center space-y-3 lg:space-y-5 px-6 sm:px-10 z-10">
              <h2 className="text-[26px] sm:text-2xl lg:!text-4xl uppercase !text-white font-bold leading-tight sm:w-lg">
                List your services and get discovered
              </h2>
              <Button asChild className="bg-white text-primary px-4 py-2 text-sm sm:text-base">
                <Link href="/auth/vendor/register">Join As a Vendor</Link>
              </Button>
            </div>
          </div>

          <div className="h-60 lg:h-full w-full lg:w-1/2 bg-[url('/cta-2.webp')] bg-cover lg:bg-[length:180%] bg-center rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none flex items-center justify-center relative overflow-hidden clippath-right">
            <div className="absolute inset-0 bg-black/40 w-full h-full"></div>
            <div className="text-center flex-center flex-col space-y-3 lg:space-y-5 px-6 sm:px-10 z-10">
              <h2 className="text-[26px] sm:text-2xl lg:!text-4xl uppercase !text-white font-bold leading-tight sm:w-lg">
                Let The World Know Our Vendors
              </h2>
              <ReferModal />
            </div>
          </div>
        </section>
      )}

      <section className={`container !mb-0 ${!isLoggedIn ? '!mt-16 lg:!mt-12' : '!mt-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-2">
            <Image height={50} width={130} src="/logo.svg" alt="Karyaa" className="w-44" />
            <p className="text-primary font-bold leading-relaxed">
              Plan. Connect. Celebrate.
            </p>
          </div>

          {/* About Karyaa */}
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900 uppercase !tracking-widest">
              About Karyaa
            </h5>
            <ul className="space-y-3">
              {aboutKaryaaLink.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-[#18181B] hover:text-primary transition-colors text-sm"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Karyaa Care */}
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900 uppercase !tracking-widest">
              Karyaa Care
            </h5>
            <ul className="space-y-3">
              {karyaacare.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-[#18181B] hover:text-primary transition-colors text-sm"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 uppercase !tracking-widest">
                Connect with Us
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`tel:${contactDetails.primaryPhone}`}
                    className="text-[#18181B] hover:text-primary transition-colors text-sm"
                  >
                    {contactDetails.primaryPhone}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`mailto:${contactDetails.mainEmail}`}
                    className="text-[#18181B] hover:text-primary transition-colors text-sm"
                  >
                    {contactDetails.mainEmail}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`mailto:${contactDetails.supportEmail}`}
                    className="text-[#18181B] hover:text-primary transition-colors text-sm"
                  >
                    {contactDetails.supportEmail}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`#`}
                    className="text-[#18181B] hover:text-primary transition-colors text-sm"
                  >
                    {contactDetails.location}
                  </Link>
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <Link
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  <Facebook />
                </Link>

                <Link
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  <Instagram />
                </Link>

                <Link
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  <Twitter />
                </Link>

                <Link
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  <Linkedin />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © Copyright {new Date().getFullYear()}. All Rights Reserved
          </p>
        </div>
      </section>
    </footer>
  )
}

export default Footer