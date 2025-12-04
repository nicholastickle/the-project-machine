import { BookOpen, Book } from 'lucide-react';

interface TaskBookIconProps {
    size?: number;
    onClick?: () => void;
    isOpen?: boolean;
}

export default function TaskBookIcon({ size = 24, onClick, isOpen = false }: TaskBookIconProps) {
    return (
        <div 
            className="cursor-pointer hover:opacity-60 transition-opacity"
            onClick={onClick}
        >
            {isOpen ? <BookOpen size={size} className='text-task-book-icon-foreground' /> : <Book size={size} className='text-task-book-icon-foreground' />}
        </div>
    );
}