import { Task } from '@/stores/types';

export default function TaskCardDurations({ estimatedHours }: { estimatedHours?: Task['estimated_hours'] }) {
  const hours = estimatedHours || 0;
  
  return (
    <span className="text-xl text-task-card-icon-foreground">
      {hours} hours est.
    </span>
  );
}
