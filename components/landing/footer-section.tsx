export default function FooterSection() {
  return (

    <div className="flex flex-row justify-center border border-border-dark ">
      <div className=" w-[60px] diagonal-lines border-x border-border-dark">
      </div>

      <footer className="flex-1 max-w-[1320px relative flex flex-col items-center text-center overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px] py-5">

        <p className="text-muted-foreground text-sm">
          © 2025 Project Machine | All rights reserved.
        </p>
      </footer>
      <div className=" w-[60px] diagonal-lines border-x border-border-dark"></div>
    </div>
  )
}
