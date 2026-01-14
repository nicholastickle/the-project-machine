import TaskCardOptionsDescription from "@/components/task-card-options/task-card-options-description";
import TaskCardOptionsSubtasks from "@/components/task-card-options/task-card-options-subtask";
import TaskCardOptionsComments from "@/components/task-card-options/task-card-options-comments";
import TaskCardOptionsTitle from "@/components/task-card-options/task-card-options-title";
import TaskCardMembersIcons from "./task-card-options-members-icons";
import TaskCardOptionsStatus from "./task-card-options-status";
import TaskCardOptionsActions from "./task-card-options-actions";

import { Task } from '@/stores/types';

export default function TaskCardOptionsPanel({ task }: { task: Task }) {

    return (
        <div className="flex flex-row rounded-xl h-[85vh] bg-task-card-panel-background text-task-card-panel-foreground p-2">

            <div className="flex flex-col flex-[10] border">
                <div className="flex flex-row flex-[1.5] border-b">
                    <div className="flex flex-[8] text-2xl p-3">
                        <TaskCardOptionsTitle task={task} />
                    </div>
                    <div className="flex flex-row flex-[4]items-center justify-end p-3">
                        <TaskCardMembersIcons members={task.members} />
                    </div>
                </div>

                <div className="flex flex-row flex-[10.5] min-h-0">
                    <div className="flex flex-col flex-[9] overflow-y-scroll min-h-0" style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e1 transparent'
                    }}>
                        <div className="flex flex-col flex-shrink-0">
                            <TaskCardOptionsDescription task={task} />
                        </div>
                        <div className="flex flex-col flex-shrink-0">
                            <TaskCardOptionsSubtasks task={task} />
                        </div>
                        <div className="flex flex-col flex-shrink-0">
                            <TaskCardOptionsComments task={task} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-[3] border-r border-t border-b">
                <div className="flex flex- col flex-[2]">
                    
                </div>
                <div className="flex flex-col flex-[6]">
                    <TaskCardOptionsStatus
                        task={task}
                    />
                </div>
                <div className="flex flex-col flex-[8] ">
                    <TaskCardOptionsActions 
                        task={task}
                    />
                </div>

            </div>

        </div >

    );
}