
import { Ellipsis, List, SquareCheckBig, AlarmClock, Play } from 'lucide-react';
interface TaskCardProps {
    id?: string;
    data?: {
        label?: string;
        value?: string;
    };
}

function TaskCard({ id, data }: TaskCardProps) {


    return (
        <div className="w-[350px] h-[175px] border border-task-card-border bg-task-card-background flex flex-col shadow-lg rounded-xl outline-offset-2 hover:outline hover:outline-4 hover:outline-task-card-border-accent transition-all duration-100">
            <div className="flex flex-[3] flex-row">
                <div className='flex-[11] items-center flex px-4 text-md font-medium text-task-card-foreground'>
                    <p>Prelim geometry sizing</p>
                </div>
                <div className='flex flex-[1] items-center justify-center m-2 text-task-card-icon-foreground hover:bg-task-card-background-accent rounded-md transition-colors cursor-pointer'>
                    <Ellipsis />
                </div>
            </div>
            <div className="flex flex-[6] flex-row bg-task-card-background-accent rounded-3xl mx-1">

                <div className='flex-[3.5]  items-center flex justify-center text-task-card-icon-foreground'>
                    <List />
                </div>
                <div className='flex flex-[3.5] flex-row gap-1 items-center justify-center text-xs text-task-card-icon-foreground'>
                    <SquareCheckBig /> <span>5/5</span>
                </div>
                <div className='flex flex-[5] flex-row '>
                    <div className='flex-[4]  items-center justify-center flex text-task-card-icon-foreground'>
                        <AlarmClock />
                    </div>
                    <div className='flex flex-[8] flex-col text-xs'>
                        <div className='flex flex-[4] flex-row  items-end text-task-card-foreground'>
                            <p>Start: <span>12 Jan</span></p>
                        </div>
                        <div className='flex flex-[4] flex-row items-center text-task-card-foreground'>
                            <p>Dur: <span> 2 days</span></p>
                        </div>
                        <div className='flex flex-[4] flex-row items-start text-task-card-foreground'>
                            <p>End: <span> 14 Jan</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-[3] flex-row ">
                <div className='flex flex-[6] items-center px-4 text-sm text-task-card-completed'>
                    <p>Completed</p>
                </div>
                <div className='flex flex-[6] flex-row '>
                    <div className='flex flex-[9] items-center justify-end px-1 text-sm text-task-card-foreground'>
                        <p>5d, 12:12:30</p>
                    </div>
                    <div className='flex flex-[3] items-center justify-center m-2 text-task-card-icon-foreground hover:bg-task-card-background-accent rounded-md transition-colors cursor-pointer'>
                        <Play />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
