import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export interface BentoCardProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    priority?: boolean;
}

const BentoCard = ({ title, description, imageSrc, imageAlt, priority = false }: BentoCardProps) => (
    <div className="overflow-hidden rounded-2xl bg-white/10  backdrop-blur-md border border-border-dark flex flex-col justify-start items-start relative">
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10 min-h-32 sm:min-h-36 md:min-h-40 lg:min-h-44">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <p className="self-stretch text-foreground text-lg font-normal leading-7 ">
                    {title} <br />
                    <span className="text-muted-foreground text-sm">{description}</span>
                </p>
            </div>
        </div>
        <div className="self-stretch  relative -mt-0.5 z-10 overflow-hidden">
            <AspectRatio ratio={16 / 9}>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority={priority}
                    className="object-center rounded-xl opacity-80 mix-blend-luminosity"
                />
            </AspectRatio>
        </div>
    </div>
)

export default BentoCard
