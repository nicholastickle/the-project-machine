import { AlignLeft } from 'lucide-react';

export default function TaskCardDescription({ description }: { description?: string }) {
  if (!description || description.trim() === '') {
    return null;
  }

  return (
    <div className="flex items-center">
      <AlignLeft size={24} className="text-task-card-icon-foreground" />
    </div>
  );
}
