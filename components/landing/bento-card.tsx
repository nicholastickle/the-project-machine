import { LucideIcon } from "lucide-react"

export interface BentoCardProps {
    title: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    priority?: boolean;
    icon?: LucideIcon;
}

const BentoCard = ({ title, description, imageSrc, imageAlt, priority = false, icon: Icon }: BentoCardProps) => (
    <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-border-dark flex flex-col justify-center items-center relative">
        <div className="self-stretch p-6 flex flex-col justify-center items-center gap-4 relative z-10">
            {Icon && (
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
            )}
            <div className="self-stretch flex flex-col justify-center items-center gap-1.5">
                <p className="self-stretch text-center text-foreground text-lg font-normal leading-7">
                    {title} <br />
                    <span className="text-muted-foreground text-sm">{description}</span>
                </p>
            </div>
        </div>
    </div>
)

export default BentoCard
