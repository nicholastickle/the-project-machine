import Image from "next/image"
import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"

export default function DashboardPreview() {
  return (
    <AnimatedSectionWhileInView delay={6}>
      <section className="flex justify-center -mt-20 sm:-mt-40 md:-mt-40 lg:-mt-20 xl:-mt-72 z-30 relative w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[95vw] lg:w-[90vw] xl:w-[1160px] max-w-[1160px] mx-auto bg-primary-light/50 rounded-2xl p-2 shadow-2xl">
        <Image
          src="/images/dashboard-preview.png"
          alt="Dashboard preview"
          width={1160}
          height={700}
          priority
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </section>
    </AnimatedSectionWhileInView>
  )
}
