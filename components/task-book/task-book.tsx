import { useState } from 'react';
import TaskBookIcon from './task-book-icon';
import TaskBookDialog from './task-book-dialog';

export default function TaskBook() {
    const [isOpen, setIsOpen] = useState(false);

    const handleIconClick = () => {
        setIsOpen(true);
    };

    return (
        <div className="absolute top-4 right-4 z-10">
            <TaskBookDialog isOpen={isOpen} onOpenChange={setIsOpen}>
                <TaskBookIcon
                    isOpen={isOpen}
                    onClick={handleIconClick}
                    size={48}
                />
            </TaskBookDialog>
        </div>
    );
}