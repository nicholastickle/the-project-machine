interface SpacerElementProps {
    height?: string;
    text?: string;
}

export default function SpacerElement({ height = "100px", text = "" }: SpacerElementProps) {
    return (
        <div
            className="relative w-full flex justify-center h-full border border-border-dark bg-background"
            style={{ height }}
        >

            <div className="w-[60px] diagonal-lines border-x border-border-dark">
            </div>

            <div className="flex flex -1 justify-start items-end max-w-[1220px] md:w-[98vw] lg:w-[98vw] xl:w-[1220px] ">
                {text && (
                    <span className="absolute text-xs text-muted-foreground/20 pl-2">
                        {text}
                    </span>
                )}
            </div>
            <div className="w-[60px] diagonal-lines border-x border-border-dark">
            </div>


        </div >
    );
}