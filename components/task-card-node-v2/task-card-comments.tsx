import { MessageSquare } from 'lucide-react';
import { TaskData } from '@/stores/types';

export default function TaskCardComments({ comments }: { comments?: TaskData['comments'] }) {
    if (!comments || comments.length === 0) {
        return null;
    }

    const commentCount = comments.length;

    return (
        <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-task-card-icon-foreground" />
            <span className="text-sm text-task-card-foreground">
                {commentCount}
            </span>
        </div>
    );
}