import { useState, useRef, useEffect, useCallback } from 'react';
import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface TaskCardTitleProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardTitle({ nodeId, data }: TaskCardTitleProps) {
    const [value, setValue] = useState(data.title || '');
    const [fontSize, setFontSize] = useState(48); // Starting font size
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateNodeData = useStore((state) => state.updateNodeData);

    const maxFontSize = 48;
    const minFontSize = 12;

    const adjustFontSize = useCallback(() => {
        if (!textAreaRef.current || !containerRef.current) return;

        const textarea = textAreaRef.current;
        const container = containerRef.current;

        // Get container dimensions
        const containerHeight = container.clientHeight;

        // Start with max size
        let currentSize = maxFontSize;

        // Test if content fits at current size
        textarea.style.fontSize = `${currentSize}px`;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        // Only reduce font size if content overflows the container height
        while (currentSize > minFontSize && textarea.scrollHeight > containerHeight) {
            currentSize -= 1;
            textarea.style.fontSize = `${currentSize}px`;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

        setFontSize(currentSize);
    }, [maxFontSize, minFontSize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        requestAnimationFrame(adjustFontSize);
    };

    const handleBlur = () => {
        updateNodeData(nodeId, { title: value.trim() });
    };

    const handleContainerClick = () => {
        textAreaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            textAreaRef.current?.blur();
        }
        e.stopPropagation();
    };

    // Update value when data changes
    useEffect(() => {
        setValue(data.title || '');
    }, [data.title]);

    // Adjust font size when value or container changes
    useEffect(() => {
        requestAnimationFrame(adjustFontSize);
    }, [value, adjustFontSize]);

    return (
        <div
            ref={containerRef}
            onClick={handleContainerClick}
            className="w-full h-[280px] flex flex-col items-center justify-center cursor-text"
        >
            <textarea
                ref={textAreaRef}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Enter task..."
                rows={1}
                className="w-full h-full bg-transparent resize-none border-none outline-none text-center font-soft text-task-card-foreground leading-tight overflow-hidden p-2"
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.1',
                }}
                spellCheck={true}
            />
        </div>
    );
}