import { useState, useRef, useEffect } from 'react';
import useStore from '@/stores/flow-store';

interface EditableTitleProps {
    nodeId: string
    title: string
}

export default function EditableTitle({ nodeId, title }: EditableTitleProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateNodeData = useStore((state) => state.updateNodeData);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    const handleParagraphClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        handleTitleClick();
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onClick={handleInputClick}
                className={`
          w-full bg-transparent 
          placeholder:text-task-card-placeholder border-none outline-none overflow-hidden
          
        `}
                placeholder="Enter task..."
                maxLength={70}
                autoComplete="off"
                spellCheck={true}
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