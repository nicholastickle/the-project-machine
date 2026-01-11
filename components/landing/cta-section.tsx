
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"
export default function CTASection() {
  return (

    <div className="flex flex-row justify-center border-x border-border-dark ">
      <div className=" w-[60px] diagonal-lines border-x border-border-dark">
      </div>
      <AnimatedSectionWhileInView className=" flex-1 max-w-[1320px relative flex flex-col items-center text-center rounded-2xl overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px] " delay={0.2}>

        <section className="w-full pt-20 md:pt-60 lg:pt-60 pb-10 md:pb-20 px-5 relative flex flex-col justify-center items-center overflow-visible">
          <div className="absolute inset-0 top-[-90px]">
            <svg
              className="w-full h-full"
              viewBox="0 0 1388 825"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <mask
                id="mask0_182_1049"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="269"
                y="27"
                width="850"
                height="493"
              >
                <rect x="269.215" y="27.4062" width="849.57" height="492.311" fill="url(#paint0_linear_182_1049)" />
              </mask>
              <g mask="url(#mask0_182_1049)">
                <g filter="url(#filter0_f_182_1049)">
                  <ellipse
                    cx="694"
                    cy="-93.0414"
                    rx="670.109"
                    ry="354.908"
                    fill="url(#paint1_radial_182_1049)"
                    fillOpacity="0.8"
                  />
                </g>
                <ellipse cx="694" cy="-91.5385" rx="670.109" ry="354.908" fill="url(#paint2_linear_182_1049)" />
                <ellipse cx="694" cy="-93.0414" rx="670.109" ry="354.908" fill="url(#paint3_linear_182_1049)" />
              </g>
              <defs>
                <filter
                  id="filter0_f_182_1049"
                  x="-234.109"
                  y="-705.949"
                  width="1856.22"
                  height="1225.82"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="129" result="effect1_foregroundBlur_182_1049" />
                </filter>
                <linearGradient
                  id="paint0_linear_182_1049"
                  x1="1118.79"
                  y1="273.562"
                  x2="269.215"
                  y2="273.562"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="hsl(var(--background))" stopOpacity="0" />
                  <stop offset="0.2" stopColor="hsl(var(--background))" stopOpacity="0.8" />
                  <stop offset="0.8" stopColor="hsl(var(--background))" stopOpacity="0.8" />
                  <stop offset="1" stopColor="hsl(var(--background))" stopOpacity="0" />
                </linearGradient>
                <radialGradient
                  id="paint1_radial_182_1049"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(683.482 245.884) rotate(-3.78676) scale(469.009 248.4)"
                >
                  <stop offset="0.1294" stopColor="hsl(var(--primary-dark))" />
                  <stop offset="0.2347" stopColor="hsl(var(--primary))" />
                  <stop offset="0.3" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
                <linearGradient
                  id="paint2_linear_182_1049"
                  x1="694"
                  y1="-446.446"
                  x2="694"
                  y2="263.369"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="1" stopColor="white" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_182_1049"
                  x1="694"
                  y1="-447.949"
                  x2="694"
                  y2="261.866"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="hsl(var(--background))" />
                  <stop offset="1" stopColor="hsl(var(--background))" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col justify-start items-center gap-9 max-w-4xl mx-auto">
            <div className="flex flex-col justify-start items-center gap-10 text-center mb-4">
              <h2 className="w-full max-w-[655px] text-center text-foreground text-2xl md:text-4xl lg:text-6xl font-semibold leading-tight md:leading-[66px]">
                Your Personal Project Planner
              </h2>
              <p className="w-full max-w-[600px] text-center text-muted-foreground text-md md:text-lg font-medium leading-relaxed">
                Start today to visualize every step, build your library of proven task templates, and best of all... the more you plan, the smarter it gets.
              </p>
            </div>
            <Link href="/canvas">
              <Button
                variant="outline"
                className="flex items-center"
                size="lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>

      </AnimatedSectionWhileInView>
      <div className=" w-[60px] diagonal-lines border-x border-border-dark">
      </div>
    </div >
  )
}


//  <Link href="/canvas">
//   <Button variant="outline" className="w-full justify-center">
//     Get started
//   </Button>
// </Link>
