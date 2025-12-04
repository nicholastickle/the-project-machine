import { useState } from 'react';
import TaskBookIcon from './task-book-icon';
import TaskBookDialog from './task-book-dialog';

import { useSidebar } from "@/components/sidebar/canvas-sidebar"

export default function TaskBook() {
    const [isTaskBookOpen, setIsTaskBookOpen] = useState(false);
    const { isOpen: sidebarIsOpen, isMobile } = useSidebar()

    const handleIconClick = () => {
        setIsTaskBookOpen(true);
    };

    return (
        <div className={`absolute bottom-3 z-10 ${!isMobile && sidebarIsOpen ? 'left-[18rem]' : 'left-[10rem]'}`}>
            <TaskBookDialog isOpen={isTaskBookOpen} onOpenChange={setIsTaskBookOpen}>
                <div className="bg-task-book-icon-background border border-task-book-icon-border rounded-full p-3 shadow-sm">
                    <TaskBookIcon
                        isOpen={isTaskBookOpen}
                        onClick={handleIconClick}
                        size={60}
                    />
                </div>
            </TaskBookDialog>
        </div>
    );
}