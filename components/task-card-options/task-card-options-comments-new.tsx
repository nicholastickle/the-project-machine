import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';
import { User, Send } from 'lucide-react';
import { useState } from 'react';

interface TaskCardOptionsCommentsNewProps {
    nodeId: string;
    comments?: TaskData['comments'];
}

export default function TaskCardOptionsCommentsNew({ nodeId, comments }: TaskCardOptionsCommentsNewProps) {
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now().toString(),
            memberId: '1',
            memberName: 'Nicholas Tickle',
            comment: newComment.trim(),
            createdDate: new Date().toISOString()
        };

        const updatedComments = [...(comments || []), comment];
        updateNodeData(nodeId, { comments: updatedComments });
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
