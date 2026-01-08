import TaskCardOptionsDescription from "@/components/task-card-options/task-card-options-description";
import TaskCardOptionsSubtasks from "@/components/task-card-options/task-card-options-subtasks";
import TaskCardOptionsComments from "@/components/task-card-options/task-card-options-comments";
import TaskCardOptionsTitle from "@/components/task-card-options/task-card-options-title";
import TaskCardMembersIcons from "./task-card-members-icons";

import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface TaskCardOptionsPanelProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardOptionsPanel({ nodeId, data }: TaskCardOptionsPanelProps) {

    return (
        <div className="flex flex-row border border-4 border-task-card-panel-border rounded-xl h-full bg-task-card-panel-background text-task-card-panel-foreground p-1">

            <div className="flex flex-col flex-[10]">
                <div className="flex flex-row flex-[1.5]">
                    <div className="flex flex-[8] border text-2xl p-3">
                        <TaskCardOptionsTitle nodeId={nodeId} title={data.title} />
                    </div>
                    <div className="flex flex-row flex-[4] border items-center justify-end p-3">
                        <TaskCardMembersIcons members={data.members} />
                    </div>
                </div>

                <div className="flex flex-row flex-[10.5]">
                    <div className="flex flex-col flex-[9]">
                        <div className="flex flex-col">
                            <TaskCardOptionsDescription nodeId={nodeId} description={data.description} />
                        </div>
                        <div className="flex flex-col">
                            <TaskCardOptionsSubtasks nodeId={nodeId} subtasks={data.subtasks} />
                        </div>
                        <div className="flex flex-col">
                            <TaskCardOptionsComments nodeId={nodeId} comments={data.comments} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-[3] border">

                <div className="flex flex-col flex-[4] border">

                    <div className="flex flex-[2] border">Status:</div>
                    <div className="flex flex-col flex-[10] border">

                        <div className="flex flex-[2] border">Not Started</div>
                        <div className="flex flex-[2] border">On-going</div>
                        <div className="flex flex-[2] border">Stuck</div>
                        <div className="flex flex-[2] border">Complete</div>
                        <div className="flex flex-[2] border">Abandoned</div>
                    </div>

                </div>
                <div className="flex flex-col flex-[8] border">
                    <div className="flex flex-[2] border">Actions</div>
                    <div className="flex flex-col flex-[10] border">
                        <div className="flex flex-[2] border">Members</div>
                        <div className="flex flex-[2] border">Save as template</div>
                        <div className="flex flex-[2] border">Archive</div>
                    </div>

                </div>

            </div>

        </div >

    );
}