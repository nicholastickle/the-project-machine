// import { useState, useRef, useEffect } from 'react';
// import useStore from '@/stores/flow-store';

// interface EditableSubtaskTimeSpentProps {
//     nodeId: string;
//     subtaskId: string;
//     timeSpent: number;
// }

// export default function EditableSubtaskTimeSpent({ nodeId, subtaskId, timeSpent }: EditableSubtaskTimeSpentProps) {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editValue, setEditValue] = useState(timeSpent.toString());
//     const inputRef = useRef<HTMLInputElement>(null);

//     const updateSubtask = useStore((state) => state.updateSubtask);

//     useEffect(() => {
//         if (isEditing && inputRef.current) {
//             inputRef.current.focus();
//             inputRef.current.select();
//         }
//     }, [isEditing]);

//     useEffect(() => {
//         if (!isEditing) {
//             setEditValue(timeSpent.toString());
//         }
//     }, [timeSpent, isEditing]);

//     const handleClick = () => {
//         setIsEditing(true);
//         setEditValue(timeSpent.toString());
//     };

//     const handleSave = () => {
//         const numValue = parseFloat(editValue) || 0;
//         updateSubtask(nodeId, subtaskId, { timeSpent: numValue });
//         setIsEditing(false);
//     };

//     const handleCancel = () => {
//         setEditValue(timeSpent.toString());
//         setIsEditing(false);
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSave();
//         } else if (e.key === 'Escape') {
//             e.preventDefault();
//             handleCancel();
//         }
//         e.stopPropagation();
//     };

//     const handleBlur = () => {
//         handleSave();
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         // Allow numbers and decimal points
//         if (/^\d*\.?\d*$/.test(value)) {
//             setEditValue(value);
//         }
//     };

//     const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
//         e.stopPropagation();
//     };

//     if (isEditing) {
//         return (
//             <div className="flex items-center justify-center text-sm">
//                 <input
//                     ref={inputRef}
//                     type="text"
//                     value={editValue}
//                     onChange={handleInputChange}
//                     onKeyDown={handleKeyDown}
//                     onBlur={handleBlur}
//                     onClick={handleInputClick}
//                     className="w-8 text-center bg-transparent border-none outline-none text-sm"
//                     placeholder="0"
//                     maxLength={4}
//                     autoComplete="off"
//                 />
//                 <span>h</span>
//             </div>
//         );
//     }

//     return (
//         <span
//             onClick={handleClick}
//             className="cursor-text text-center text-sm block"
//         >
//             {timeSpent} h
//         </span>
//     );
// }