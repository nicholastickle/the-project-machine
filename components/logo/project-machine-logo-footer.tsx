import Image from "next/image"

export function ProjectMachineLogoFooter() {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex-shrink-0">
                <Image
                    src="/logos/logo.svg"
                    alt="Project Machine"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>
            <span className="font-semibold text-foreground text-base whitespace-nowrap">
                Project Machine
            </span>
        </div>
    )
}