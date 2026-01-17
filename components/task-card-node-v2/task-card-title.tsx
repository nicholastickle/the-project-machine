import { useState, useRef, useEffect, useCallback } from 'react';
import useStore from '@/stores/flow-store';
import { Task } from '@/stores/types';

export default function TaskCardTitle({ task }: { task: Task }) {
    const [value, setValue] = useState(task.title || '');
    const [fontSize, setFontSize] = useState(48); // Starting font size
    const [focused, setFocused] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    const updateTask = useStore((state) => state.updateTask);
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
        updateTask(task.id, { title: value.trim() });
        setFocused(false);
        if (textAreaRef.current) {
            textAreaRef.current.readOnly = true;
        }
    };

    const handleDivClick = (e: React.MouseEvent) => {
       
        if (e.target !== textAreaRef.current) {
            setFocused(true);
            if (textAreaRef.current) {
                textAreaRef.current.readOnly = false;
            }
            textAreaRef.current?.focus();
        }
    };

   
    const handleTextAreaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        setFocused(true);
        if (textAreaRef.current) {
            textAreaRef.current.readOnly = false;
            textAreaRef.current.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab' || (e.key === 'Enter' && e.shiftKey) || (e.key === 'Escape')) {
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
            onClick={handleDivClick}
            className={"w-full h-[280px] flex flex-col items-center justify-center cursor-default "}
        >
            <textarea
                ref={textAreaRef}
                onClick={handleTextAreaClick}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder='Enter Task...'
                maxLength={200}
                autoComplete="off"
                spellCheck={true}
                className={`w-full h-full bg-transparent resize-none border-none outline-none text-center font-soft text-task-card-foreground leading-tight overflow-hidden p-2 ${focused ? 'nodrag' : ''}`}
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.1',
                    pointerEvents: focused ? 'auto' : 'none',
                }}

            />
        </div>
    );
}