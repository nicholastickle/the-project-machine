import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import useProjectStore from '@/stores/project-store';
import { type Task, type Subtask, type ProjectMember } from '@/stores/types';

// Convert seconds to hours:minutes format
const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

// Format date for display
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Get assignee names from members
const getAssigneeNames = (members: ProjectMember[] | undefined): string => {
    if (!members || members.length === 0) return 'Unassigned';
    return members.map(member => member.name || 'Unnamed').join(', ');
};

// Get status color for conditional formatting
const getStatusColor = (status: string): string => {
    switch (status) {
        case 'completed': return 'FF28A745'; // Green
        case 'in_progress': return 'FF17A2B8'; // Blue
        case 'stuck': return 'FFDC3545'; // Red
        case 'planned': return 'FFFFC107'; // Yellow
        case 'cancelled': return 'FF6C757D'; // Gray
        default: return 'FF6F42C1'; // Purple for backlog
    }
};

export const useExcelExport = () => {
    const { getActiveProject } = useProjectStore();

    const exportProjectToExcel = useCallback(async () => {
        const activeProject = getActiveProject();

        if (!activeProject) {
            alert('No active project selected for export');
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();

            // Set workbook properties
            workbook.creator = 'Project Machine';
            workbook.created = new Date();
            workbook.title = `${activeProject.project.name} - Export`;

            // Main Tasks Worksheet
            const tasksWorksheet = workbook.addWorksheet('Tasks');

            // Define columns for tasks sheet
            tasksWorksheet.columns = [
                { header: 'Task ID', key: 'id', width: 12 },
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Assignees', key: 'assignees', width: 25 },
                { header: 'Estimated Hours', key: 'estimatedHours', width: 15 },
                { header: 'Time Spent', key: 'timeSpent', width: 15 },
                { header: 'Progress %', key: 'progress', width: 12 },
                { header: 'Subtasks Count', key: 'subtaskCount', width: 15 },
                { header: 'Created Date', key: 'createdAt', width: 15 },
                { header: 'Updated Date', key: 'updatedAt', width: 15 },
                { header: 'Description', key: 'description', width: 50 },
            ];

            // Style the header row
            tasksWorksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            tasksWorksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };
            tasksWorksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
            tasksWorksheet.getRow(1).height = 25;

            // Add task data
            activeProject.tasks.forEach((task, index) => {
                const estimatedHours = formatDuration(task.estimated_hours);
                const timeSpent = formatDuration(task.time_spent);
                const progress = task.estimated_hours > 0
                    ? Math.round((task.time_spent / task.estimated_hours) * 100)
                    : 0;

                const row = tasksWorksheet.addRow({
                    id: task.id.slice(0, 8), // Show first 8 characters of UUID
                    title: task.title || 'Untitled Task',
                    status: task.status.replace('_', ' ').toUpperCase(),
                    assignees: getAssigneeNames(task.members),
                    estimatedHours,
                    timeSpent,
                    progress: `${progress}%`,
                    subtaskCount: task.subtasks?.length || 0,
                    createdAt: formatDate(task.created_at),
                    updatedAt: formatDate(task.updated_at),
                    description: task.description || '',
                });

                // Conditional formatting based on status
                const statusColor = getStatusColor(task.status);
                row.getCell('status').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: statusColor }
                };
                row.getCell('status').font = { color: { argb: 'FFFFFFFF' }, bold: true };

                // Progress bar styling
                const progressCell = row.getCell('progress');
                if (progress >= 100) {
                    progressCell.font = { color: { argb: 'FF28A745' }, bold: true };
                } else if (progress >= 50) {
                    progressCell.font = { color: { argb: 'FFFFC107' }, bold: true };
                } else if (progress > 0) {
                    progressCell.font = { color: { argb: 'FF17A2B8' } };
                }

                // Alternate row colors
                if (index % 2 === 1) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8F9FA' }
                    };
                }
            });

            // Subtasks Worksheet
            const subtasksWorksheet = workbook.addWorksheet('Subtasks');

            subtasksWorksheet.columns = [
                { header: 'Parent Task ID', key: 'taskId', width: 12 },
                { header: 'Parent Task Title', key: 'taskTitle', width: 25 },
                { header: 'Subtask ID', key: 'subtaskId', width: 12 },
                { header: 'Subtask Title', key: 'title', width: 30 },
                { header: 'Completed', key: 'isCompleted', width: 12 },
                { header: 'Estimated Duration', key: 'estimatedDuration', width: 18 },
                { header: 'Time Spent', key: 'timeSpent', width: 15 },
                { header: 'Created Date', key: 'createdAt', width: 15 },
                { header: 'Updated Date', key: 'updatedAt', width: 15 },
            ];

            // Style subtasks header
            subtasksWorksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            subtasksWorksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF28A745' }
            };
            subtasksWorksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
            subtasksWorksheet.getRow(1).height = 25;

            // Add subtask data
            activeProject.tasks.forEach(task => {
                task.subtasks?.forEach((subtask, index) => {
                    const row = subtasksWorksheet.addRow({
                        taskId: task.id.slice(0, 8),
                        taskTitle: task.title || 'Untitled Task',
                        subtaskId: subtask.id.slice(0, 8),
                        title: subtask.title || 'Untitled Subtask',
                        isCompleted: subtask.is_completed ? 'YES' : 'NO',
                        estimatedDuration: formatDuration(subtask.estimated_duration),
                        timeSpent: formatDuration(subtask.time_spent),
                        createdAt: formatDate(subtask.created_at),
                        updatedAt: formatDate(subtask.updated_at),
                    });

                    // Style completed subtasks
                    if (subtask.is_completed) {
                        row.getCell('isCompleted').fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FF28A745' }
                        };
                        row.getCell('isCompleted').font = { color: { argb: 'FFFFFFFF' }, bold: true };
                    } else {
                        row.getCell('isCompleted').fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFDC3545' }
                        };
                        row.getCell('isCompleted').font = { color: { argb: 'FFFFFFFF' }, bold: true };
                    }
                });
            });

            // Project Summary Worksheet
            const summaryWorksheet = workbook.addWorksheet('Project Summary');

            // Calculate summary stats
            const totalTasks = activeProject.tasks.length;
            const completedTasks = activeProject.tasks.filter(t => t.status === 'completed').length;
            const inProgressTasks = activeProject.tasks.filter(t => t.status === 'in_progress').length;
            const stuckTasks = activeProject.tasks.filter(t => t.status === 'stuck').length;
            const totalEstimatedHours = activeProject.tasks.reduce((sum, task) => sum + task.estimated_hours, 0);
            const totalTimeSpent = activeProject.tasks.reduce((sum, task) => sum + task.time_spent, 0);
            const totalSubtasks = activeProject.tasks.reduce((sum, task) => sum + (task.subtasks?.length || 0), 0);
            const completedSubtasks = activeProject.tasks.reduce((sum, task) =>
                sum + (task.subtasks?.filter(st => st.is_completed).length || 0), 0);

            // Add summary data
            summaryWorksheet.addRow(['Project Name', activeProject.project.name]);
            summaryWorksheet.addRow(['Project Description', activeProject.project.description || 'No description']);
            summaryWorksheet.addRow(['Created Date', formatDate(activeProject.project.created_at)]);
            summaryWorksheet.addRow(['Last Updated', formatDate(activeProject.project.updated_at)]);
            summaryWorksheet.addRow(['']);
            summaryWorksheet.addRow(['TASK STATISTICS']);
            summaryWorksheet.addRow(['Total Tasks', totalTasks]);
            summaryWorksheet.addRow(['Completed Tasks', completedTasks]);
            summaryWorksheet.addRow(['In Progress Tasks', inProgressTasks]);
            summaryWorksheet.addRow(['Stuck Tasks', stuckTasks]);
            summaryWorksheet.addRow(['Completion Rate', `${Math.round((completedTasks / totalTasks) * 100)}%`]);
            summaryWorksheet.addRow(['']);
            summaryWorksheet.addRow(['TIME TRACKING']);
            summaryWorksheet.addRow(['Total Estimated Hours', formatDuration(totalEstimatedHours)]);
            summaryWorksheet.addRow(['Total Time Spent', formatDuration(totalTimeSpent)]);
            summaryWorksheet.addRow(['Time Efficiency', `${Math.round((totalTimeSpent / totalEstimatedHours) * 100)}%`]);
            summaryWorksheet.addRow(['']);
            summaryWorksheet.addRow(['SUBTASK STATISTICS']);
            summaryWorksheet.addRow(['Total Subtasks', totalSubtasks]);
            summaryWorksheet.addRow(['Completed Subtasks', completedSubtasks]);
            summaryWorksheet.addRow(['Subtask Completion Rate', `${Math.round((completedSubtasks / totalSubtasks) * 100)}%`]);

            // Format summary sheet
            summaryWorksheet.getColumn(1).width = 25;
            summaryWorksheet.getColumn(2).width = 30;

            // Style headers in summary
            [6, 13, 17].forEach(rowNum => {
                const row = summaryWorksheet.getRow(rowNum);
                row.font = { bold: true, size: 12 };
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE9ECEF' }
                };
            });

            // Generate and download the file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const timestamp = new Date().toISOString().split('T')[0];
            const projectName = activeProject.project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `${projectName}_export_${timestamp}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Failed to export to Excel:', error);
            alert('Failed to export project data. Please try again.');
        }
    }, [getActiveProject]);

    return {
        exportProjectToExcel,
    };
};