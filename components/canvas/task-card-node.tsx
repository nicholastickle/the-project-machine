import { useCallback, ChangeEvent } from 'react';

interface TaskCardProps {
    id?: string;
    data?: {
        label?: string;
        value?: string;
    };
}

function TaskCard({ id, data }: TaskCardProps) {
    const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className="text-updater-node">
            <div>
                <label htmlFor="text">Text:</label>
                <input
                    id="text"
                    name="text"
                    onChange={onChange}
                    className="nodrag"
                    defaultValue={data?.value || ''}
                    placeholder={data?.label || 'Enter task...'}
                />
            </div>
        </div>
    );
}

export default TaskCard;
