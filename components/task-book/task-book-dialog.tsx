import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Archive, Edit, Play } from "lucide-react"
import { mockSections } from './mock-data'

interface TaskBookDialogProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TaskBookDialog({ children, isOpen, onOpenChange }: TaskBookDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent className="border-none p-0 max-w-4xl w-full h-[90vh] focus:outline-none">
                <div className="flex flex-col h-full bg-background text-foreground rounded-2xl">
                    <div className="flex flex-col flex-[1] border border-red-500">
                        <DialogHeader className="p-6">
                            <DialogTitle className="text-2xl font-bold text-center w-full border border-red-500">Task Book</DialogTitle>
                        </DialogHeader>
                    </div>
                    <div className="flex flex-[11] flex-row">
                        <div className="flex flex-col flex-[3] border border-red-500" >
                            <div className="flex flex-[0.5] border border-red-500 justify-center items-center">
                                <p className="text-xl font-semibold">Chapters</p>
                            </div>
                            <div className="flex flex-[11.5] border border-red-500 p-4">
                                <Accordion type="multiple" className="w-full">
                                    {mockSections.map((section) => (
                                        <AccordionItem key={section.id} value={section.id}>
                                            <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-2">
                                                {section.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-1">
                                                    {section.tasks.map((task) => (
                                                        <div key={task.id} className="p-1 border rounded cursor-pointer flex items-center gap-3 text-xs">
                                                            <span className="text-lg">•</span>
                                                            <div className="font-medium">{task.title}</div>

                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                        <div className="flex flex-col flex-[9] border border-red-500">

                            <div className="flex flex-row flex-[1] border border-red-500" >

                                <div className="flex flex-[5] border border-red-500 items-center p-2 text-lg font-semibold">
                                    <p>Task name</p>
                                </div>
                                <div className="flex flex-[3] border border-red-500 justify-center items-center gap-2">
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-background hover:text-foreground">
                                        <Edit size={16} />
                                        Edit
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-background hover:text-foreground">
                                        <Play size={16} />
                                        Use
                                    </Button>
                                </div>
                                <div className="flex flex-col flex-[3] border border-red-500">

                                    <div className="flex flex-[6] border border-red-500 p-1 text-xs items-center">

                                        <p>Last updated</p>
                                    </div>
                                    <div className="flex flex-[6] border border-red-500 p-1 text-xs items-center">
                                        <p>Last used</p>
                                    </div>

                                </div>

                            </div>
                            <Separator />
                            <div className="flex flex-[9] border border-red-500 p-2">
                                <p>Task details</p>
                            </div>
                            <div className="flex flex-row flex-[1] border border-red-500">

                                <div className="flex flex-[9] border border-red-500">

                                </div>
                                <div className="flex flex-[3] border border-red-500 justify-center items-center">
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-background hover:text-foreground">
                                        <Archive size={16} />
                                        Archive
                                    </Button>
                                </div>

                            </div>



                        </div>
                    </div>
                </div>
            </DialogContent>


        </Dialog>
    );
}