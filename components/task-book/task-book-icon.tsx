import { BookOpen, Book } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskBookIconProps {
    size?: number;
    onClick?: () => void;
    isOpen?: boolean;
    hasNewTask?: boolean;
}

export default function TaskBookIcon({ size = 24, onClick, isOpen = false, hasNewTask = false }: TaskBookIconProps) {
    return (
        <div
            className={`relative cursor-pointer hover:opacity-60 transition-opacity ${hasNewTask && !isOpen ? 'animate-pulse' : ''}`}
            onClick={onClick}
            style={{
                ...(hasNewTask && !isOpen && {
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    boxShadow: '0 0 0 3px rgba(255, 165, 0, 0.5)',
                    borderRadius: '9999px',
                })
            }}
        >
            <div>
                {isOpen ? <BookOpen size={size} className='text-task-book-icon-foreground' /> : <Book size={size} className='text-task-book-icon-foreground/70' />}
            </div>
            {hasNewTask && !isOpen && (
                <Badge
                    variant="default"
                    className="absolute -top-4 -right-10 text-[10px] px-1.5 py-0 h-5 pointer-events-none"
                >
                    New Task Added
                </Badge>
            )}
        </div>
    );
}