import { useState, useRef, useEffect, useCallback } from 'react';
import useStore from '@/stores/flow-store';
import { Task } from '@/stores/types';

export default function TaskCardTitle({ task }: { task: Task }) {
    const [value, setValue] = useState(task.title || '');
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
        const containerHeight = container.clientHeight;

        let currentSize = maxFontSize;

        textarea.style.fontSize = `${currentSize}px`;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

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
        updateNodeData(task.id, { task: { title: value.trim() } } as Partial<Task>);
    };

    const handleContainerClick = () => {
        textAreaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    useEffect(() => {
        setValue(task.title || '');
    }, [task.title]);

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
                maxLength={200}
                autoComplete="off"
                spellCheck={true}
                className="w-full h-full bg-transparent resize-none border-none outline-none text-center font-soft text-task-card-foreground leading-tight overflow-hidden p-2"
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.1',
                }}

            />
        </div>
    );
}