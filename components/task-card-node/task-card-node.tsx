
import { Ellipsis, List, SquareCheckBig, AlarmClock, Play } from 'lucide-react';
import TaskHandles from '@/components/task-card-node/task-handles';
import EditableTitle from '@/components/task-card-node/editable-title';
import SelectStatus from '@/components/task-card-node/status-options';

interface TaskCardProps {
    id: string;
    data: {
        title: string;
        status: string;
    };
}


export default function TaskCard({ id, data }: TaskCardProps) {

// const statusColorClass = (() => {
//     switch (data.status) {
//         case 'Not started':
//             return 'border-task-card-border';
//         case 'On-going':
//             return 'border-task-card-on-going';
//         case 'Stuck':
//             return 'border-task-card-stuck';
//         case 'Complete':
//             return 'border-task-card-complete';
//         case 'Abandoned':
//             return 'border-task-card-abandoned';
//         default:
//             return 'border-task-card-background';
//     }
// })();

const statusColorClass = (() => {
    switch (data.status) {
        case 'Not started':
            return 'bg-task-card-background-accent';
        case 'On-going':
            return 'bg-task-card-on-going/20';
        case 'Stuck':
            return 'bg-task-card-stuck/20';
        case 'Complete':
            return 'bg-task-card-complete/20';
        case 'Abandoned':
            return 'bg-task-card-abandoned/20';
        default:
            return 'bg-task-card-background-accent';
    }
})();


    return (
        <div className={`w-[350px] h-[175px] border border-task-card-border  bg-task-card-background flex flex-col shadow-lg rounded-xl`}>
            <div className='flex flex-[3] flex-row'>
                <div className='flex-[11] items-center flex px-4 text-md font-medium text-task-card-foreground'>
                    <EditableTitle
                        nodeId={id}
                        title={data.title}
                    />
                </div>
                <div className='flex flex-[1] items-center justify-center m-2 text-task-card-icon-foreground hover:bg-task-card-background-accent rounded-md transition-colors cursor-pointer'>
                    <Ellipsis />
                </div>
            </div>
            <div className={`flex flex-[6] flex-row ${statusColorClass} rounded-3xl mx-1`}>
                <div className='flex-[3.5]  items-center flex justify-center text-task-card-icon-foreground'>
                    <List />
                </div>
                <div className='flex flex-[3.5] flex-row gap-1 items-center justify-center text-xs text-task-card-icon-foreground'>
                    <SquareCheckBig /> <span>X/X</span>
                </div>
                <div className='flex flex-[5] flex-row '>
                    <div className='flex-[4]  items-center justify-center flex text-task-card-icon-foreground'>
                        <AlarmClock />
                    </div>
                    <div className='flex flex-[8] flex-col text-xs'>
                        <div className='flex flex-[4] flex-row  items-end text-task-card-foreground'>
                            <p>Start: <span>DD MM</span></p>
                        </div>
                        <div className='flex flex-[4] flex-row items-center text-task-card-foreground'>
                            <p>Dur: <span> X days</span></p>
                        </div>
                        <div className='flex flex-[4] flex-row items-start text-task-card-foreground'>
                            <p>End: <span> DD MM</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-[3] flex-row ">
                <div className='flex flex-[6] items-center px-4 text-sm text-task-card-completed'>
                    <SelectStatus nodeId={id} status={data.status} />
                </div>
                <div className='flex flex-[6] flex-row '>
                    <div className='flex flex-[9] items-center justify-end px-1 text-sm text-task-card-foreground'>
                        <p>X days, X hrs</p>
                    </div>
                    <div className='flex flex-[3] items-center justify-center m-2 text-task-card-icon-foreground hover:bg-task-card-background-accent rounded-md transition-colors cursor-pointer'>
                        <Play />
                    </div>
                </div>
            </div>
            <TaskHandles />
        </div>
    );
}
