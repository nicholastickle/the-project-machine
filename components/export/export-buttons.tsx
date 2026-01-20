
import ExcelButton from "@/components/export/excel-button"
import ShareButton from "@/components/export/share-button"
import FeedbackButton from "@/components/export/feedback-button"

interface ExportButtonsProps {
    isChatVisible?: boolean
}

export default function ExportButtons({ isChatVisible = true }: ExportButtonsProps) {


    return (
        <div
            className={`absolute top-2 z-50 flex gap-2 transition-all duration-500 ${isChatVisible ? 'right-[370px]' : 'right-2'
                }`}
        >
            <ExcelButton />
            <ShareButton />
            <FeedbackButton />
        </div>
    )
}
