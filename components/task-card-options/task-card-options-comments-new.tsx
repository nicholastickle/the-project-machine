import useStore from '@/stores/flow-store';
import { Task, TaskComment } from '@/stores/types';
import { User, Send } from 'lucide-react';
import { useState } from 'react';


export default function TaskCardOptionsCommentsNew({ task }: { task: Task }) {
    const updateTask = useStore((state) => state.updateTask);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: TaskComment = {
            id: Date.now().toString(),
            task_id: task.id,
            user_id: 'nicholas-tickle', // Should come from current user context
            user_name: 'Nicholas Tickle', // Should come from current user context
            content: newComment.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const updatedComments = [...(task.comments || []), comment];
        updateTask(task.id, { comments: updatedComments });
        setNewComment('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className="flex items-center gap-3 p-1.5 bg-white border border-gray-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600" />
            </div>

            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                maxLength={1000}
            />

            <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={16} className="text-gray-600" />
            </button>
        </div>
    );
}
