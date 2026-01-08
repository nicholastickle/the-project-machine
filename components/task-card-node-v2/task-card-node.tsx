import TaskHandles from '@/components/task-card-node-v2/task-card-handles';
import EditableTitle from '@/components/task-card-node-v1/editable-title';
import useStore from '@/stores/flow-store';
import { TaskCardProps } from '@/stores/types';


export default function TaskCard({ id, data }: TaskCardProps) {

    const updateNodeData = useStore((state) => state.updateNodeData);


    return (
        <div
            className={`w-[600px] min-h-[200px] border-2 border-task-card-border bg-task-card-background flex flex-col rounded-xl shadow-lg`}

        >
            <div className="h-full flex flex-col rounded-xl ">
                <div className='flex flex-row  '>
                    <div className='flex-[11] items-center flex px-4 py-5 text-3xl font-medium text-task-card-foreground overflow-y-auto'>
                        <EditableTitle
                            nodeId={id}
                            title={data.title}
                        />
                    </div>

                </div>

                <TaskHandles />
            </div>
        </div>
    );
}