import { useState, useRef, useEffect } from 'react';
import useStore from '@/stores/flow-store';

interface EditableSubtaskTitleProps {
    nodeId: string;
    subtaskId: string;
    title: string;
    isCompleted: boolean;
}

export default function EditableSubtaskTitle({ nodeId, subtaskId, title, isCompleted }: EditableSubtaskTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const updateSubtask = useStore((state) => state.updateSubtask);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // Set initial height
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) {
            setEditValue(title);
        }
    }, [title, isEditing]);

    const handleTitleClick = () => {
        setIsEditing(true);
        setEditValue(title);
    };

    const handleSave = () => {
        const trimmedValue = editValue.trim();
        updateSubtask(nodeId, subtaskId, { title: trimmedValue });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(title);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
        e.stopPropagation();
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditValue(e.target.value);

        // Auto-resize the textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    const handleInputClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
    };

    const handleSpanClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        handleTitleClick();
    };

    if (isEditing) {
        return (
            <textarea
                ref={inputRef}
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onClick={handleInputClick}
                className="w-full bg-transparent border-none outline-none text-md resize-none"
                placeholder="Enter subtask..."
                maxLength={50}
                autoComplete="off"
                spellCheck={true}
                rows={1}
                style={{ minHeight: 'auto', height: 'auto' }}
            />
        );
    }

    return (
        <span
            onClick={handleSpanClick}
            className={`cursor-text w-full text-md ${isCompleted && title ? 'line-through text-muted-foreground' : ''
                }`}
        >
            {title || <span className="text-muted-foreground">Enter subtask...</span>}
        </span>
    );
}