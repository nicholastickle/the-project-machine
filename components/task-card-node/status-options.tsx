

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectValue,
} from "@/components/ui/select"

import CustomSelectTrigger from "@/components/task-card-node/custom-select-trigger";

interface SelectStatusProps {
    nodeId: string;
    status: string;
}

export default function SelectStatus({ nodeId, status }: SelectStatusProps) {
    return (
        <Select value={status} >
            <CustomSelectTrigger className=" flex border-none bg-transparent p-0 focus:ring-0 focus:ring-offset-0 mr-10 ">
                <SelectValue placeholder="Select a status" />
            </CustomSelectTrigger>
            <SelectContent side="bottom">
                <SelectGroup className="text-xs">
                    <SelectLabel>Status:</SelectLabel>
                    <SelectItem value="Not started">Not started</SelectItem>
                    <SelectItem value="On-going">On-going</SelectItem>
                    <SelectItem value="Stuck">Stuck</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Abandoned">Abandoned</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
