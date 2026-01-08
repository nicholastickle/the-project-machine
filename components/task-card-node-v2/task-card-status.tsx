export default function TaskCardStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
      <span className="text-md text-task-card-foreground">{status}</span>
    </div>
  );
}
