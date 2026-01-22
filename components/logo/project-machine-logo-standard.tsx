import Image from "next/image"

interface ProjectMachineLogoStandardProps {
    size?: number
}

export function ProjectMachineLogoStandard({ size = 32 }: ProjectMachineLogoStandardProps) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-${Math.floor(size/4)} h-${Math.floor(size/4)} relative flex-shrink-0`} style={{ width: size, height: size }}>
                <Image
                    src="/logos/logo.svg"
                    alt="Project Machine"
                    width={size}
                    height={size}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>
            
        </div>
    )
}