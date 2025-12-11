import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface SubtaskTableProps {
    nodeId: string;
}

export default function SubtaskTable({ nodeId }: SubtaskTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-task-card-border">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Subtasks</TableHead>
                    <TableHead className="text-center">Duration Est.</TableHead>
                    <TableHead className="text-center">Time Spent</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="hover:bg-transparent border-task-card-border">
                    <TableCell>
                        <Checkbox />
                    </TableCell>
                    <TableCell>Research requirements</TableCell>
                    <TableCell className="text-center">2h</TableCell>
                    <TableCell className="text-center">1.5h</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-task-card-border">
                    <TableCell>
                        <Checkbox />
                    </TableCell>
                    <TableCell>Design mockups</TableCell>
                    <TableCell className="text-center">4h</TableCell>
                    <TableCell className="text-center">3h</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-task-card-border">
                    <TableCell>
                        <Checkbox checked />
                    </TableCell>
                    <TableCell>Implementation</TableCell>
                    <TableCell className="text-center">6h</TableCell>
                    <TableCell className="text-center">5.5h</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-task-card-border">
                    <TableCell>
                        <Checkbox />
                    </TableCell>
                    <TableCell>Testing</TableCell>
                    <TableCell className="text-center">2h</TableCell>
                    <TableCell className="text-center">0h</TableCell>
                </TableRow>
            </TableBody>
            <TableFooter className="bg-transparen border-task-card-border">
                <TableRow className="hover:bg-transparent border-task-card-border ">
                    <TableCell></TableCell>
                    <TableCell className="font-medium"></TableCell>
                    <TableCell className="text-center font-medium">14h</TableCell>
                    <TableCell className="text-center font-medium">10h</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}