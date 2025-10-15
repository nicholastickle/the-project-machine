import React from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/landing/header"
import AnimatedSection from "@/components/ui/animated-section"
import Link from "next/link"
export default function HeroSection() {
  return (
    <main
      className="max-w-[1320px] mx-auto relative flex flex-col items-center text-center rounded-2xl overflow-hidden my-6 py-0 px-4 w-full h-[400px] sm:h-[450px] md:w-[98vw] md:h-[500px] lg:w-[98vw] lg:h-[600px] xl:w-[1220px] xl:h-[810px] md:px-0 max-w-[1220px]"
      style={{
        '--primary': '25 95% 53%',
        '--primary-light': '33 100% 70%'
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
            @keyframes blinkSlow {
              0% { opacity: 0.01; }
              25% { opacity: 0.15; }
              40% { opacity: 0.15; }
              70% { opacity: 0.01; }
              100% { opacity: 0.01; }
            }
            @keyframes blinkMedium {
              0% { opacity: 0.01; }
              30% { opacity: 0.15; }
              45% { opacity: 0.15; }
              75% { opacity: 0.01; }
              100% { opacity: 0.01; }
            }
            @keyframes blinkFast {
              0% { opacity: 0.01; }
              35% { opacity: 0.15; }
              50% { opacity: 0.15; }
              80% { opacity: 0.01; }
              100% { opacity: 0.01; }
            }
            @keyframes buttonPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .blink-1 { opacity: 0.01; animation: blinkSlow 6s ease-in-out infinite; }
          .blink-2 { opacity: 0.01; animation: blinkMedium 6s ease-in-out infinite 1s; }
          .blink-3 { opacity: 0.01; animation: blinkFast 6s ease-in-out infinite 2s; }
          .blink-4 { opacity: 0.01; animation: blinkSlow 6s ease-in-out infinite 3s; }
          .blink-5 { opacity: 0.01; animation: blinkMedium 6s ease-in-out infinite 4s; }
          .blink-6 { opacity: 0.01; animation: blinkFast 6s ease-in-out infinite 5s; }
          .pulse-button { animation: buttonPulse 3s ease-in-out infinite; }
        `
      }} />
      {/* SVG Background */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1220 810"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g clipPath="url(#clip0_186_1134)">
            <mask
              id="mask0_186_1134"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="10"
              y="-1"
              width="1200"
              height="812"
            >
              <rect x="10" y="-0.84668" width="1200" height="811.693" fill="url(#paint0_linear_186_1134)" />
            </mask>
            <g mask="url(#mask0_186_1134)">
              {/* Grid Rectangles */}
              {[...Array(35)].map((_, i) => (
                <React.Fragment key={`row1-${i}`}>
                  <rect
                    x={-20.0891 + i * 36}
                    y="9.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="45.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="81.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="117.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="153.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="189.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="225.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="261.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="297.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="333.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="369.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="405.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="441.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="477.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="513.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="549.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="585.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="621.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="657.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="693.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="729.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={-20.0891 + i * 36}
                    y="765.2"
                    width="35.6"
                    height="35.6"
                    stroke="hsl(var(--foreground))"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                </React.Fragment>
              ))}
              {/* Animated Rectangles with fill */}
              <rect x="699.711" y="81" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-1" />
              <rect x="195.711" y="153" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-2" />
              <rect x="1023.71" y="153" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-3" />
              <rect x="123.711" y="225" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-4" />
              <rect x="1095.71" y="225" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-5" />
              <rect x="951.711" y="297" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-6" />
              <rect x="231.711" y="333" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-1" />
              <rect x="303.711" y="405" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-2" />
              <rect x="87.7109" y="405" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-3" />
              <rect x="519.711" y="405" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-4" />
              <rect x="771.711" y="405" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-5" />
              <rect x="591.711" y="477" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-6" />
              <rect x="447.711" y="117" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-2" />
              <rect x="663.711" y="189" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-4" />
              <rect x="375.711" y="261" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-1" />
              <rect x="807.711" y="333" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-6" />
              <rect x="159.711" y="369" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-3" />
              <rect x="879.711" y="441" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-5" />
              <rect x="411.711" y="513" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-2" />
              <rect x="735.711" y="549" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-1" />
              <rect x="267.711" y="585" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-4" />
              <rect x="1007.71" y="621" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-6" />
              <rect x="555.711" y="657" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-3" />
              <rect x="843.711" y="693" width="36" height="36" fill="hsl(var(--primary-light))" className="blink-5" />
            </g>

            <g filter="url(#filter0_f_186_1134)">
              <path
                d="M1447.45 -87.0203V-149.03H1770V1248.85H466.158V894.269C1008.11 894.269 1447.45 454.931 1447.45 -87.0203Z"
                fill="url(#paint1_linear_186_1134)"
              />
            </g>

            <g filter="url(#filter1_f_186_1134)">
              <path
                d="M1383.45 -151.02V-213.03H1706V1184.85H402.158V830.269C944.109 830.269 1383.45 390.931 1383.45 -151.02Z"
                fill="url(#paint2_linear_186_1134)"
                fillOpacity="0.69"
              />
            </g>

            <g style={{ mixBlendMode: "lighten" }} filter="url(#filter2_f_186_1134)">
              <path
                d="M1567.45 -231.02V-293.03H1890V1104.85H586.158V750.269C1128.11 750.269 1567.45 310.931 1567.45 -231.02Z"
                fill="url(#paint3_linear_186_1134)"
              />
            </g>

            <g style={{ mixBlendMode: "overlay" }} filter="url(#filter3_f_186_1134)">
              <path
                d="M65.625 750.269H284.007C860.205 750.269 1327.31 283.168 1327.31 -293.03H1650V1104.85H65.625V750.269Z"
                fill="url(#paint4_radial_186_1134)"
                fillOpacity="0.64"
              />
            </g>
          </g>

          <rect
            x="0.5"
            y="0.5"
            width="1219"
            height="809"
            rx="15.5"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.06"
          />

          <defs>
            <filter
              id="filter0_f_186_1134"
              x="147.369"
              y="-467.818"
              width="1941.42"
              height="2035.46"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="159.394" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <filter
              id="filter1_f_186_1134"
              x="-554.207"
              y="-1169.39"
              width="3216.57"
              height="3310.61"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="478.182" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <filter
              id="filter2_f_186_1134"
              x="426.762"
              y="-452.424"
              width="1622.63"
              height="1716.67"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="79.6969" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <filter
              id="filter3_f_186_1134"
              x="-253.163"
              y="-611.818"
              width="2221.95"
              height="2035.46"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="159.394" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <linearGradient
              id="paint0_linear_186_1134"
              x1="35.0676"
              y1="23.6807"
              x2="903.8"
              y2="632.086"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" stopOpacity="0" />
              <stop offset="1" stopColor="hsl(var(--muted-foreground))" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_186_1134"
              x1="1118.08"
              y1="-149.03"
              x2="1118.08"
              y2="1248.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.578125" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_186_1134"
              x1="1054.08"
              y1="-213.03"
              x2="1054.08"
              y2="1184.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.578125" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_186_1134"
              x1="1238.08"
              y1="-293.03"
              x2="1238.08"
              y2="1104.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.578125" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <radialGradient
              id="paint4_radial_186_1134"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(989.13 557.24) rotate(47.9516) scale(466.313 471.424)"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.157789" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </radialGradient>
            <clipPath id="clip0_186_1134">
              <rect width="1220" height="810" rx="16" fill="hsl(var(--foreground))" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20">
        <AnimatedSection delay={5}>
          <Header />
        </AnimatedSection>
      </div>

      <div className="relative z-10 space-y-6 md:space-y-9 lg:space-y-12 mb-7 md:mb-8 lg:mb-16 max-w-md md:max-w-[500px] lg:max-w-[588px] mt-28 md:mt-[120px] lg:mt-[160px] px-4">
        <AnimatedSection delay={5.5}>
          <h1 className="text-foreground text-2xl md:text-4xl lg:text-6xl font-semibold leading-tight">
            All Projects Start Here
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={6}>
          <p className="text-foreground text-sm md:text-base lg:text-lg font-normal leading-relaxed max-w-lg mx-auto">
            AI Project Manager using Canvas planning to formulate early project plans, task durations, risk, and resourcing.
          </p>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={6.5}>
        <Link href="/canvas">
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-full overflow-hidden">
              <div className="w-full h-full rounded-full animate-spin"
              >
              </div>
            </div>
            <Button className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 px-8 py-3 rounded-full font-medium text-base shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 pulse-button">

              Start
            </Button>
          </div>
        </Link>
      </AnimatedSection>
    </main>
  )
}

