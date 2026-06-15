import taskManagementListView from '../../page_object_model/btp_applications_page/planning/task_management/task_management.listview.page';

describe('BTP Task Management - Functional Test', () => {
    // Shared variables across tests
    let taskDescription: string;
    let editedTaskDescription: string;
    let updatedComment: string;
    let updatedHeader: string;
    let updatedLongDescription: string;

    before(function () {
        // Initialize shared test data
        const timestamp = Date.now();
        taskDescription = `AUTO TASK ${timestamp}`;
        editedTaskDescription = `UPDATED AUTO TASK ${timestamp}`;
        updatedComment = `EDITED COMMENT ${timestamp}`;
        updatedHeader = `Updated Header ${timestamp}`;
        updatedLongDescription = `Updated Long Description ${timestamp}`;
    });

    it('should navigate to Task Management and create a new task', async function () {
        // this.timeout(900000); // 15 minutes
        await taskManagementListView.navigateToTaskManagementListView();
        await taskManagementListView.createTask(taskDescription, {
            activity: 'Asset Inspection',
            priority: 'Low',
            assignedTo: 'ashweyth.sunil@asint.net',
            objectType: 'None'
        });
    });

    it('should verify task was created successfully', async function () {
        // this.timeout(900000);
        await taskManagementListView.verifyTaskCreated(taskDescription);
    });

    it('should open task detail and edit header details', async function () {
        // this.timeout(900000);
        await taskManagementListView.openTaskDetail(taskDescription);
        await taskManagementListView.editHeaderDetails(
            updatedHeader,
            updatedLongDescription
        );
    });

    it('should edit task details and save changes', async function () {
        this.timeout(900000);
        await taskManagementListView.editTaskAndSave({
            description: editedTaskDescription,
            activity: 'Asset Inspection',
            priority: 'Low',
            assignedTo: 'ashweyth.sunil@asint.net',
            comment: updatedComment
        });
    });

    it('should update task status to Completed', async function () {
        // this.timeout(900000);
        await taskManagementListView.updateStatusToCompleted();
    });

    it('should delete the task', async function () {
        // this.timeout(900000);
        await taskManagementListView.deleteTaskAndConfirm();
    });

    it('should verify task deletion', async function () {
        // this.timeout(900000);
        await taskManagementListView.searchAndVerifyTaskDeleted(editedTaskDescription);
    });
}).timeout(900000);