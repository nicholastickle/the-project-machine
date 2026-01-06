import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { useTheme } from "next-themes"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
    imageUrl: string
    imageUrlDark?: string
    imageAlt: string
}

export default function FeatureCard({ icon: Icon, title, description, imageUrl, imageUrlDark, imageAlt }: FeatureCardProps) {
    const { theme } = useTheme()

    const currentImageUrl = theme === 'dark' && imageUrlDark ? imageUrlDark : imageUrl

    return (
        <Card className="overflow-hidden flex flex-col h-full bg-background border border-border-dark shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <div className=" flex-shrink-0">
                        <Icon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg text-foreground font-semibold mb-2 text-balance text-left">{title}</h3>
                        <p className="text-sm text-muted-foreground text-pretty text-left">{description}</p>
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <AspectRatio ratio={4 / 3} className="bg-transparent">
                    <Image src={currentImageUrl} alt={imageAlt} fill className="object-contain" />
                </AspectRatio>
            </div>
        </Card>
    )
}

