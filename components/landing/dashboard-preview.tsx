import Image from "next/image" // Import the Image component

export default function DashboardPreview() {
  return (
    <div className="w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[95vw] lg:w-[90vw] xl:w-[1160px] max-w-[1160px] mx-auto">
      <div className="bg-primary-light/50 rounded-2xl p-2 shadow-2xl">
        <Image
          src="/images/dashboard-preview.png"
          alt="Dashboard preview"
          width={1160}
          height={700}
          priority
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </div>
    </div>
  )
}
