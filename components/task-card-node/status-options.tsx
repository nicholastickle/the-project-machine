

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"

import CustomSelectTrigger from "@/components/task-card-node/custom-select-trigger";
import useStore from "@/stores/flow-store";

interface SelectStatusProps {
    nodeId: string;
    status: string;
}

export default function SelectStatus({ nodeId, status }: SelectStatusProps) {

    const updateNodeData = useStore((state) => state.updateNodeData);

    const handleStatusChange = (newStatus: string) => {
        updateNodeData(nodeId, { status: newStatus });
    };

    return (
        <Select value={status} onValueChange={handleStatusChange}>
            <CustomSelectTrigger className=" flex border-none p-0 focus:ring-0 focus:ring-offset-0 mr-10 bg-task-card-status-options-background">
                <SelectValue placeholder="Select a status" />
            </CustomSelectTrigger>
            <SelectContent side="bottom" className=" bg-task-card-status-options-background text-task-card-status-options-foreground border border-task-card-status-options-border rounded-lg shadow-md">
                <SelectGroup className="">

                    <SelectItem value="Not started" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-not-started" />
                        Not started
                    </SelectItem>
                    <SelectItem value="On-going" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-on-going" />
                        On-going
                    </SelectItem>
                    <SelectItem value="Stuck" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-stuck" />
                        Stuck
                    </SelectItem>
                    <SelectItem value="Complete" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-complete" />
                        Complete
                    </SelectItem>
                    <SelectItem value="Abandoned" className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-abandoned" />
                        Abandoned
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}