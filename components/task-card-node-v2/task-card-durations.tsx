import { TaskData } from '@/stores/types';

export default function TaskCardDurations({ estimatedHours }: { estimatedHours?: TaskData['estimatedHours'] }) {
  const hours = estimatedHours || 0;
  
  return (
    <span className="text-xl text-task-card-icon-foreground">
      {hours} hours est.
    </span>
  );
}
