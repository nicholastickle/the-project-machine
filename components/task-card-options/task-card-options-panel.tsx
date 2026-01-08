import TaskCardOptionsDescription from "@/components/task-card-options/task-card-options-description";
import TaskCardOptionsSubtasks from "@/components/task-card-options/task-card-options-subtask";
import TaskCardOptionsComments from "@/components/task-card-options/task-card-options-comments";
import TaskCardOptionsTitle from "@/components/task-card-options/task-card-options-title";
import TaskCardMembersIcons from "./task-card-options-members-icons";

import { TaskData } from '@/stores/types';

interface TaskCardOptionsPanelProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardOptionsPanel({ nodeId, data }: TaskCardOptionsPanelProps) {

    return (
        <div className="flex flex-row rounded-xl h-[85vh] bg-task-card-panel-background text-task-card-panel-foreground p-2">

            <div className="flex flex-col flex-[10] border">
                <div className="flex flex-row flex-[1.5] border-b">
                    <div className="flex flex-[8] text-2xl p-3">
                        <TaskCardOptionsTitle nodeId={nodeId} title={data.title} />
                    </div>
                    <div className="flex flex-row flex-[4]items-center justify-end p-3">
                        <TaskCardMembersIcons members={data.members} />
                    </div>
                </div>

                <div className="flex flex-row flex-[10.5] min-h-0">
                    <div className="flex flex-col flex-[9] overflow-y-scroll min-h-0 pr-2" style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e1 transparent'
                    }}>
                        <div className="flex flex-col flex-shrink-0">
                            <TaskCardOptionsDescription nodeId={nodeId} description={data.description} />
                        </div>
                        <div className="flex flex-col flex-shrink-0">
                            <TaskCardOptionsSubtasks nodeId={nodeId} subtasks={data.subtasks} />
                        </div>
                        <div className="flex flex-col flex-shrink-0">
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