"use client";

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { useClientStore } from "@/store/clientStore"
import { getBrandDetailsAction } from "@/app/actions/brand";
import { useEffect, useState } from "react";
import ReferModal from "../ReferModal";
import NewsletterField from "../NewsLetterField";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandPinterest, IconBrandTiktok, IconBrandWhatsapp, IconBrandX, IconBrandYoutube, IconPhone } from "@tabler/icons-react";

const Footer = () => {
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
    {
      text: "Gallery",
      href: "/gallery"
    },
  ]

  const karyaacare = [
    {
      text: "Terms and Condition",
      href: "/terms-and-conditions"
    },
    {
      text: "Privacy Policy",
      href: "/privacy-policy"
    },
    {
      text: "Cookie Policy",
      href: "/cookie-policy"
    },
    {
      text: "FAQ",
      href: "/faq"
    },
  ]

  const socialLinks = [
    { href: "https://wa.me/971508806209?text=Hello%20I%20want%20to%20know%20more%20about%20your%20service", icon: <IconBrandWhatsapp />, label: "WhatsApp" },
    { href: "#", icon: <IconPhone />, label: "Phone" },
    { href: "https://www.facebook.com/share/1JqhwFJQE4/?mibextid=wwXIfr", icon: <IconBrandFacebook />, label: "Facebook" },
    { href: "https://www.instagram.com/karyaa_uae?igsh=MWtrcTB6M2l4dm5uaw%3D%3D&utm_source=qr", icon: <IconBrandInstagram />, label: "Instagram" },
    { href: "https://www.tiktok.com/@karyaa_uae?_t=ZS-8yEf86IaZma&_r=1", icon: <IconBrandTiktok />, label: "TikTok" },
    { href: "https://www.linkedin.com/company/107969110", icon: <IconBrandLinkedin />, label: "LinkedIn" },
    { href: "https://www.youtube.com/@Karyaa_uae", icon: <IconBrandYoutube />, label: "YouTube" },
    { href: "https://pin.it/2c3v4wKOA", icon: <IconBrandPinterest />, label: "Pinterest" },
  ]

  return (
    <footer className={`w-full py-5 px-4 bg-primary flex-center flex-col ${!isLoggedIn ? "mt-32 lg:mt-24" : "mt-8 lg:mt-10"}`}>
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

      <section className={`container max-md:!px-0 !mb-0 ${!isLoggedIn ? '!mt-9 lg:!mt-12' : '!mt-0'}`}>

        {/* Mobile Accordion */}
        <div className="block lg:hidden lg:mt-6">
          <div className="lg:mb-0">
            <Image height={50} width={130} src="/logo-gold.svg" alt="Karyaa" className="w-40 sm:w-44" />
            <p className="text-secondary font-bold leading-relaxed mt-2">
              Plan. Connect. Celebrate.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full max-lg:mt-5 space-y-2">
            {/* About Karyaa */}
            <AccordionItem value="about" className="border-gray-600">
              <AccordionTrigger className="text-white hover:text-secondary font-semibold uppercase tracking-widest text-sm py-4">
                About Karyaa
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 pb-4">
                  {aboutKaryaaLink.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="text-white hover:text-secondary transition-colors text-sm block"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Karyaa Care */}
            <AccordionItem value="care" className="border-gray-600">
              <AccordionTrigger className="text-white hover:text-secondary font-semibold uppercase tracking-widest text-sm py-4">
                Karyaa Care
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 pb-4">
                  {karyaacare.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="text-white hover:text-secondary transition-colors text-sm block"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Newsletter - Always Visible on Mobile */}
          <div className="mt-8 space-y-4">
            <p className="text-white text-sm leading-relaxed">
              Get an exclusive offer when you sign up, plus insider access to even more offers, new arrivals, style tips and more
            </p>
            <NewsletterField />
          </div>

          {/* Social Media - Always Visible on Mobile */}
          <div className="mt-8 flex flex-col items-center justify-center md:block">
            <h5 className="font-semibold !text-white uppercase tracking-widest text-sm mb-4">
              Get Connected
            </h5>
            <div className="flex items-center gap-4 flex-wrap">
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="text-secondary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Brand Section */}
          <div className="space-y-2">
            <Image height={50} width={130} src="/logo-gold.svg" alt="Karyaa" className="w-44" />
            <p className="text-secondary font-bold leading-relaxed">
              Plan. Connect. Celebrate.
            </p>
          </div>

          {/* About Karyaa */}
          <div className="space-y-3">
            <h5 className="font-semibold !text-white uppercase !tracking-widest">
              About Karyaa
            </h5>
            <ul className="space-y-5">
              {aboutKaryaaLink.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-secondary transition-colors text-sm"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Karyaa Care */}
          <div className="space-y-3">
            <h5 className="font-semibold !text-white uppercase !tracking-widest">
              Karyaa Care
            </h5>
            <ul className="space-y-5">
              {karyaacare.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-secondary transition-colors text-sm"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold !text-white uppercase !tracking-widest mb-5">
                  Subscribe to newsletter
                </h5>
                <p className="text-white !text-xs">Get event planning tips and special offers.</p>
                <NewsletterField />
              </div>
            </div>

            <div>
              <h5 className="font-semibold !text-white uppercase !tracking-widest mb-5">
                Connect With Us
              </h5>
              <div className="flex items-center gap-4 flex-wrap">
                {socialLinks.map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    className="text-secondary hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t flex flex-col gap-4 items-center border-gray-600">
          <p className="text-white text-center !text-xs md:!text-sm max-w-3xl leading-relaxed">
            This website serves solely as a marketplace platform.
            All financial and contractual transactions occur directly between customers and vendors.
            We are not liable for any transaction-related disputes, losses, or claims.
          </p>

          <p className="text-center text-gray-400 text-sm">
            © Copyright {new Date().getFullYear()}. All Rights Reserved
          </p>
        </div>
      </section>
    </footer>
  )
}

export default Footer