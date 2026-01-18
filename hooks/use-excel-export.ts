import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import useProjectStore from '@/stores/project-store';
import { type Task, type Subtask, type ProjectMember } from '@/stores/types';

// Format hours to 2 decimal places
const formatDuration = (hours: number): string => {
    return hours.toFixed(2);
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
            workbook.creator = 'The Project Machine';
            workbook.created = new Date();
            workbook.title = `${activeProject.project.name} - Project Export`;

            // Single Combined Worksheet
            const worksheet = workbook.addWorksheet('Project Data');

            // Add Project Machine branding row
            const brandingCell = worksheet.getCell('A1');
            brandingCell.value = {
                text: '🚀 Powered by The Project Machine - Click to visit our website',
                hyperlink: 'https://theprojectmachine.com'
            };
            brandingCell.font = {
                bold: true,
                size: 16,
                color: { argb: 'FF4472C4' },
                underline: true
            };
            brandingCell.alignment = { horizontal: 'left', vertical: 'middle' };
            worksheet.getRow(1).height = 45;

            // Merge cells for branding across all columns
            worksheet.mergeCells('A1:I1');

            // Add spacing
            worksheet.getRow(2).height = 15;

            // Calculate project summary stats
            const totalTasks = activeProject.tasks.length;
            const completedTasks = activeProject.tasks.filter(t => t.status === 'completed').length;
            const inProgressTasks = activeProject.tasks.filter(t => t.status === 'in_progress').length;
            const stuckTasks = activeProject.tasks.filter(t => t.status === 'stuck').length;
            const backlogTasks = activeProject.tasks.filter(t => t.status === 'backlog').length;
            const plannedTasks = activeProject.tasks.filter(t => t.status === 'planned').length;
            const cancelledTasks = activeProject.tasks.filter(t => t.status === 'cancelled').length;
            const totalEstimatedHours = activeProject.tasks.reduce((sum, task) => sum + task.estimated_hours, 0);
            const totalTimeSpent = activeProject.tasks.reduce((sum, task) => sum + task.time_spent, 0);

            // Add project summary section
            let currentRow = 3;

            // Project info
            worksheet.getCell(`A${currentRow}`).value = 'PROJECT INFORMATION';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14, color: { argb: 'FF2C3E50' } };
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            currentRow++;

            worksheet.getCell(`A${currentRow}`).value = `Project: ${activeProject.project.name}`;
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            currentRow++;

            if (activeProject.project.description) {
                worksheet.getCell(`A${currentRow}`).value = `Description: ${activeProject.project.description}`;
                worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
                currentRow++;
            }

            worksheet.getCell(`A${currentRow}`).value = `Created: ${formatDate(activeProject.project.created_at)} | Last Updated: ${formatDate(activeProject.project.updated_at)}`;
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            currentRow++;

            // Task statistics
            currentRow++;
            worksheet.getCell(`A${currentRow}`).value = 'PROJECT SUMMARY';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14, color: { argb: 'FF2C3E50' } };
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            currentRow++;

            worksheet.getCell(`A${currentRow}`).value = `Total Tasks: ${totalTasks} | Backlog: ${backlogTasks} | Planned: ${plannedTasks} | In Progress: ${inProgressTasks} | Stuck: ${stuckTasks} | Completed: ${completedTasks} | Cancelled: ${cancelledTasks}`;
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            currentRow++;

            worksheet.getCell(`A${currentRow}`).value = `Task Completion Rate: ${Math.round((completedTasks / totalTasks) * 100)}% | Estimated Time: ${formatDuration(totalEstimatedHours)}hrs | Time Spent: ${formatDuration(totalTimeSpent)}hrs`;
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            currentRow++;

            // Add spacing before task data
            currentRow += 2;

            // Set up column structure
            worksheet.getColumn(1).width = 35;  // Task/Subtask Title (combined)
            worksheet.getColumn(2).width = 15;  // Status
            worksheet.getColumn(3).width = 20;  // Project Member
            worksheet.getColumn(4).width = 15;  // Estimated Hours
            worksheet.getColumn(5).width = 15;  // Time Spent
            worksheet.getColumn(6).width = 15;  // Last Updated
            worksheet.getColumn(7).width = 40;  // Description
            worksheet.getColumn(8).width = 40;  // Notes and Comments

            // Add column headers
            const headersRow = worksheet.getRow(currentRow);
            headersRow.values = [
                'Task Title',
                'Status',
                'Project Member',
                'Estimated Hours (hrs)',
                'Time Spent (hrs)',
                'Last Updated',
                'Description',
                'Notes & Comments'
            ];

            // Style headers
            headersRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headersRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            headersRow.height = 40;

            // Apply fill only to columns that have data (columns 1-8)
            for (let col = 1; col <= 8; col++) {
                headersRow.getCell(col).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF34495E' }
                };
            }

            currentRow++;

            // Add task and subtask data
            activeProject.tasks.forEach((task, taskIndex) => {
                // Add main task row
                const taskRow = worksheet.getRow(currentRow);
                taskRow.values = [
                    task.title || 'untitled task',
                    task.status.replace('_', ' '),
                    getAssigneeNames(task.members),
                    formatDuration(task.estimated_hours),
                    formatDuration(task.time_spent),
                    formatDate(task.updated_at),
                    task.description || '-',
                    task.comments?.map(c => c.content).join('; ') || '-'
                ];

                // Style main task row - column 1 left aligned, rest center aligned, all vertically centered
                taskRow.font = { bold: true };
                taskRow.alignment = { horizontal: 'center', vertical: 'middle' };

                // Override column 1 to be left aligned
                taskRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

                currentRow++;

                // Add subtasks if they exist
                if (task.subtasks && task.subtasks.length > 0) {
                    task.subtasks.forEach((subtask) => {
                        const subtaskRow = worksheet.getRow(currentRow);
                        subtaskRow.values = [
                            subtask.title || 'untitled subtask',
                            subtask.is_completed ? 'completed' : 'not completed',
                            getAssigneeNames(task.members), // Use parent task's project members
                            formatDuration(subtask.estimated_duration || 0),
                            formatDuration(subtask.time_spent || 0),
                            formatDate(subtask.updated_at),
                            '-', // Subtasks don't have descriptions in current schema
                            '-'  // No comments for subtasks in current schema
                        ];

                        // Center align all columns, vertically centered
                        subtaskRow.alignment = { horizontal: 'center', vertical: 'middle' };

                        // Override column 1 to be left aligned with indent
                        subtaskRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', indent: 2 };

                        currentRow++;
                    });
                }

                // Add blank row between tasks (except for the last task)
                if (taskIndex < activeProject.tasks.length - 1) {
                    currentRow++;
                }
            });

            // Apply borders to the data table area
            const dataStartRow = currentRow - activeProject.tasks.reduce((count, task) => {
                return count + 1 + (task.subtasks?.length || 0) + (task.subtasks?.length ? 0 : 0);
            }, 0) - (activeProject.tasks.length - 1); // Account for blank rows

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
            link.download = `TheProjectMachine_${projectName}_${timestamp}.xlsx`;

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