import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Navigation, MapPin, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import rowhouseEconomicImg from "@/images/properties/Rowhouse Economic.png";
import propImgB from "@/images/properties/Duplex Deluxe.png";
import propImgC from "@/images/properties/Rowhouse Compound.png";
import propImgD from "@/images/properties/Triplex.png";

const TOLLWAY_URL =
  "https://www.google.com/maps/dir/STAR+Tollway,+Batangas/Randy's+store,+P5PH%2B532,+Batangas+City,+Batangas/@13.842405,121.128617,75691m/data=!3m1!1e3!4m14!4m13!1m5!1m1!1s0x33bd6c47c81960ad:0xb202f8fcae4d8cc4!2m2!1d121.1421878!2d13.9497285!1m5!1m1!1s0x33bd197c66633f33:0xf3269378daf86148!2m2!1d121.177656!2d13.7353748!3e0?hl=en&entry=ttu";
const SM_URL =
  "https://www.google.com/maps?ll=13.750405,121.122659&z=12&t=h&hl=en&gl=PH&saddr=SM+City+Batangas,+Brgy,+M.Pastor+Ave,+Pallocan+Kanluran,+Village,+Batangas+City,+Batangas&daddr=Randy%27s+store,+P5PH%2B532,+Batangas+City,+Batangas&dirflg=d";
const TOLLWAY_EMBED =
  "https://maps.google.com/maps?saddr=STAR+Tollway,+Batangas&daddr=Randy%27s+store,+P5PH%2B532,+Batangas+City,+Batangas&dirflg=d&output=embed";
const SM_EMBED =
  "https://maps.google.com/maps?saddr=SM+City+Batangas,+Batangas+City,+Batangas&daddr=Randy%27s+store,+P5PH%2B532,+Batangas+City,+Batangas&dirflg=d&output=embed";

const routes = {
  tollway: { label: "STAR Tollway", time: "~43 min", distance: "~37.7 km", embed: TOLLWAY_EMBED, url: TOLLWAY_URL },
  sm:      { label: "SM City Batangas", time: "~25 min", distance: "~15 km",   embed: SM_EMBED,      url: SM_URL },
};

const propertySlides = [
  {
    src: rowhouseEconomicImg,
    alt: "Rowhouse Economic",
    link: `${createPageUrl("PropertyTypeUnits")}?type=rowhouse`,
  },
  {
    src: propImgB,
    alt: "Duplex Deluxe",
    link: `${createPageUrl("PropertyTypeUnits")}?type=duplex`,
  },
  {
    src: propImgC,
    alt: "Rowhouse Compound",
    link: `${createPageUrl("PropertyTypeUnits")}?type=rowhouse&unit=rowhouse-compound-unit`,
  },
  {
    src: propImgD,
    alt: "Triplex",
    link: `${createPageUrl("PropertyTypeUnits")}?type=triplex`,
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useScrollReveal({ threshold: 0.1, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={`scroll-reveal-init ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function IntroductionSection() {
  const [activeRoute, setActiveRoute] = useState("tollway");
  const route = routes[activeRoute];

  return (
    <section className="bg-[#f0fdf4] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top carousel */}
        <Reveal>
          <div className="mb-14">
            <p className="text-[#16a34a] text-xs font-semibold uppercase tracking-widest mb-3">
              Vicmar Homes
            </p>

            <Carousel className="relative w-full">
              <CarouselContent className="-ml-4">
                {propertySlides.map((slide) => (
                  <CarouselItem key={slide.alt} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <Link to={slide.link} className="group block overflow-hidden rounded-2xl shadow-md">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="intro-img h-[240px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Navigation arrows removed */}
            </Carousel>
          </div>
        </Reveal>

        {/* Bottom: text left + map right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <Reveal delay={100}>
            <div className="h-full rounded-2xl bg-white/70 border border-[#bbf7d0] p-8 shadow-sm">
              <h3 className="text-3xl md:text-4xl font-bold text-[#16a34a] mb-6 leading-tight">
                Where Comfort Meets Eco-Friendly Living
              </h3>
              <div className="text-gray-600 space-y-4 text-sm leading-relaxed mb-8">
                <p>
                  Vicmar Homes is a sustainable and affordable housing project located in Barangay San Jose Sico, Batangas City. Designed with modern families in mind, the project emphasizes resource efficiency and encourages home-based food gardening, promoting a healthy and self-sufficient lifestyle. The housing units feature flexible layouts that can adapt to the diverse needs of residents, making them practical and comfortable for everyone. Vicmar Homes is more than just a place to live—it is a community that values sustainability, affordability, and quality of life.
                </p>
                <p>
                  Through its thoughtful design and eco-friendly initiatives, Vicmar Homes aims to provide families with a safe, comfortable, and nurturing environment to grow and thrive.
                </p>
              </div>
              <Link
                to={createPageUrl("AboutUs")}
                className="inline-block bg-[#16a34a] hover:bg-[#22c55e] text-white font-semibold px-7 py-3 rounded-full transition-colors text-sm"
              >
                Learn More About Us
              </Link>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg border border-[#bbf7d0] bg-white">
              <div className="bg-[#16a34a] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#86efac]" />
                  <div>
                    <p className="text-white font-bold text-sm">How to Get Here</p>
                    <p className="text-[#86efac] text-xs">Directions to Vicmar Homes</p>
                  </div>
                </div>
                <div className="flex bg-white/15 rounded-full p-0.5">
                  {Object.entries(routes).map(([key, r]) => (
                    <button
                      key={key}
                      onClick={() => setActiveRoute(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        activeRoute === key
                          ? "bg-white text-[#16a34a] shadow"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-[320px]">
                <iframe
                  key={activeRoute}
                  src={route.embed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", minHeight: "320px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Directions from ${route.label}`}
                />
              </div>

              <div className="bg-[#f0fdf4] border-t border-[#bbf7d0] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span className="text-[#16a34a] text-xs font-semibold">{route.time}</span>
                  </div>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500 text-xs">{route.distance}</span>
                </div>
                <a
                  href={route.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#16a34a] hover:text-[#22c55e] text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in Maps
                </a>
              </div>
            </div>
          </Reveal>
        </div>

      </div>

      <style>{`
        .intro-img { transition: transform 0.45s ease, opacity 0.45s ease; }
      `}</style>
    </section>
  );
}
