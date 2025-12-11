import { useState } from 'react';
import TaskBookIcon from './task-book-icon';
import TaskBookDialog from './task-book-dialog';
import useStore from '@/stores/flow-store';

import { useSidebar } from "@/components/ui/sidebar"

export default function TaskBook() {
    const [isTaskBookOpen, setIsTaskBookOpen] = useState(false);
    const { open, isMobile } = useSidebar()
    const hasNewTask = useStore((state) => state.hasNewTask);
    const clearNewTaskIndicator = useStore((state) => state.clearNewTaskIndicator);

    const handleIconClick = () => {
        setIsTaskBookOpen(true);
        if (hasNewTask) {
            clearNewTaskIndicator();
        }
    };

    return (
        <div className={`absolute bottom-3 z-10 ${!isMobile && open ? 'left-[30rem]' : 'left-[17rem]'} ${isMobile ? 'left-[8rem]' : ''}`}>
            <TaskBookDialog isOpen={isTaskBookOpen} onOpenChange={setIsTaskBookOpen}>
                <div className="bg-task-book-icon-background border border-task-book-icon-border rounded-full p-3 shadow-sm">
                    <TaskBookIcon
                        isOpen={isTaskBookOpen}
                        onClick={handleIconClick}
                        size={60}
                        hasNewTask={hasNewTask}
                    />
                </div>
            </TaskBookDialog>
        </div>
    );
}

// ${!isMobile && open ? 'left-[275px]' : 'left-[55px]'}`