import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';
import { useState } from 'react';

interface TaskCardOptionsCommentsProps {
    nodeId: string;
    comments?: TaskData['comments'];
}

export default function TaskCardOptionsComments({ nodeId, comments }: TaskCardOptionsCommentsProps) {
    const node = useStore((state) => state.nodes.find(n => n.id === nodeId));
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now().toString(),
            memberId: 'current-user', // This should come from auth context
            memberName: 'Current User', // This should come from auth context
            comment: newComment.trim(),
            createdDate: new Date().toISOString()
        };

        const updatedComments = [...(comments || []), comment];
        updateNodeData(nodeId, { comments: updatedComments });
        setNewComment('');
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex items-center mb-2">Activity</div>
            <div className="flex-1 overflow-y-auto mb-2">
                {comments?.map((comment) => (
                    <div key={comment.id} className="mb-2 p-2 bg-gray-100 rounded text-xs">
                        <div className="font-semibold">{comment.memberName}</div>
                        <div className="text-gray-600">{comment.comment}</div>
                        <div className="text-gray-400 text-xs mt-1">
                            {new Date(comment.createdDate).toLocaleDateString()}
                        </div>
                    </div>
                )) || <div className="text-sm text-gray-500">No comments</div>}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 p-2 text-xs border rounded"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                    onClick={handleAddComment}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
