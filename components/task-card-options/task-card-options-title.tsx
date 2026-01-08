import { useState, useRef, useEffect } from 'react';
import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface TaskCardPanelTitleProps {
    nodeId: string
    title: TaskData['title'];
}

export default function TaskCardPanelTitle({ nodeId, title }: TaskCardPanelTitleProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const updateNodeData = useStore((state) => state.updateNodeData);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
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

        updateNodeData(nodeId, { title: trimmedValue });

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

    const handleParagraphClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
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
                className={`
          w-full bg-transparent resize-none
          placeholder:text-task-card-placeholder border-none outline-none
          
        `}
                placeholder="Enter task..."
                maxLength={200}
                autoComplete="off"
                spellCheck={true}
                rows={1}
                style={{ minHeight: 'auto', height: 'auto' }}
            />
        );
    }

    return (
        <p
            onClick={handleParagraphClick}
            className={`
            cursor-text w-full overflow-hidden break-words
        `}

        >
            {title
                ? title
                : <span className="placeholder:text-task-card-placeholder text-task-card-placeholder">Enter task...</span>
            }
        </p>
    );
}