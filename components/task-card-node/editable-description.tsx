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
            // Set initial height
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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

        // Auto-resize the textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
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
            <div className="w-full flex flex-col p-1">
                <span className="text-md font-medium underline text-muted-foreground mb-1">Description:</span>
                <textarea
                    ref={textareaRef}
                    value={editValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onClick={handleInputClick}
                    className="w-full bg-transparent text-md placeholder:text-muted-foreground text-muted-foreground resize-none border-none outline-none"
                    placeholder="Enter description..."
                    maxLength={1000}
                    autoComplete="off"
                    spellCheck={true}
                    rows={1}
                    style={{ minHeight: 'auto', height: 'auto' }}
                />
            </div>
        );
    }

    return (
        <div
            onClick={handleParagraphClick}
            className="cursor-text w-full h-full text-md text-muted-foreground overflow-hidden break-words flex flex-col p-1"
        >
            <span className="font-medium underline mb-1 ">Description:</span>
            <div>
                {description
                    ? description
                    : <span >Enter description...</span>
                }
            </div>
        </div>
    );
}


