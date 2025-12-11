import { useState, useRef, useEffect } from 'react';
import useStore from '@/stores/flow-store';

interface EditableDescriptionProps {
    nodeId: string
    description?: string
}

export default function EditableDescription({ nodeId, description = "" }: EditableDescriptionProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(description);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const updateNodeData = useStore((state) => state.updateNodeData);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) {
            setEditValue(description);
        }
    }, [description, isEditing]);

    const handleDescriptionClick = () => {
        setIsEditing(true);
        setEditValue(description);
    };

    const handleSave = () => {
        const trimmedValue = editValue.trim();
        updateNodeData(nodeId, { description: trimmedValue });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(description);
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
    };

    const handleInputClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
    };

    const handleParagraphClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        handleDescriptionClick();
    };

    if (isEditing) {
        return (
            <div className="w-full h-full flex flex-col">
                <span className="text-sm font-medium underline text-task-card-placeholder mb-1">Description:</span>
                <textarea
                    ref={textareaRef}
                    value={editValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onClick={handleInputClick}
                    className="flex-1 w-full bg-transparent text-sm placeholder:text-task-card-placeholder text-muted-foreground resize-none border-none outline-none"
                    placeholder="Enter description..."
                    maxLength={150}
                    autoComplete="off"
                    spellCheck={true}
                />
            </div>
        );
    }

    return (
        <div
            onClick={handleParagraphClick}
            className="cursor-text w-full h-full text-sm text-muted-foreground overflow-hidden break-words flex flex-col"
        >
            <span className="font-medium underline mb-1 ">Description:</span>
            <div className="flex-1">
                {description
                    ? description
                    : <span >Enter description...</span>
                }
            </div>
        </div>
    );
}