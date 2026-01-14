import useStore from '@/stores/flow-store';
import { Task } from '@/stores/types';
import { User} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function TaskCardOptionsCommentsExisting({ task }: { task: Task }) {
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingCommentId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCommentId]);

    const handleEdit = (comment: NonNullable<Task['comments']>[0]) => {
        setEditingCommentId(comment.id);
        setEditValue(comment.content);
    };

    const handleSave = (commentId: string) => {
        if (!editValue.trim()) return;

        const updatedComments = task.comments?.map(comment =>
            comment.id === commentId
                ? { ...comment, content: editValue.trim(), editedDate: new Date().toISOString() }
                : comment
        );

        updateNodeData(task.id, { comments: updatedComments });
        setEditingCommentId(null);
        setEditValue('');
    };

    const handleCancel = () => {
        setEditingCommentId(null);
        setEditValue('');
    };

    const handleDelete = (commentId: string) => {
        const updatedComments = task.comments?.filter(comment => comment.id !== commentId);
        updateNodeData(task.id, { comments: updatedComments });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, commentId: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave(commentId);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    const handleBlur = (commentId: string) => {
        if (editValue.trim()) {
            handleSave(commentId);
        } else {
            handleCancel();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Sort comments by date, latest first
    const sortedComments = task.comments ? [...task.comments].reverse() : [];

    if (!task.comments || task.comments.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No comments yet
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedComments.map((comment) => (
                <div key={comment.id} className="space-y-1 p-1.5">
                    {/* Row 1: Avatar, name, and date */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-gray-600" />
                        </div>
                        <div className="flex-1 flex items-center justify-start gap-2">
                            <span className="text-sm font-medium">{comment.user_name}</span>
                            <span className="text-xs text-gray-500">
                                {formatDate(comment.created_at)}
                                {comment.updated_at && ' (edited)'}
                            </span>
                        </div>
                    </div>

                    {/* Row 2: Comment text */}
                    <div className='px-1.5 pl-11'>
                        <input
                            ref={editingCommentId === comment.id ? inputRef : undefined}
                            type="text"
                            value={editingCommentId === comment.id ? editValue : comment.content}
                            onChange={editingCommentId === comment.id ? (e) => setEditValue(e.target.value) : undefined}
                            onKeyDown={editingCommentId === comment.id ? (e) => handleKeyDown(e, comment.id) : undefined}
                            onBlur={editingCommentId === comment.id ? () => handleBlur(comment.id) : undefined}
                            readOnly={editingCommentId !== comment.id}
                            maxLength={1000}
                            className={`w-full text-sm bg-transparent border-none outline-none ${editingCommentId === comment.id ? 'bg-gray-50 rounded border' : ''
                                }`}
                        />
                    </div>

                    {/* Row 3: Edit and Delete buttons */}
                    <div className="flex gap-3 pl-11">
                        <button
                            onClick={() => handleEdit(comment)}
                            className="flex items-center gap-1 text-xs text-muted hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(comment.id)}
                            className="flex items-center gap-1 text-xs text-muted hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
