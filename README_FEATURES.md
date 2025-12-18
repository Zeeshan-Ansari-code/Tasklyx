# Tasklyx - Feature Documentation

## Recently Implemented Features

### 1. File Upload for Task Attachments ✅

**Location**: `src/app/api/tasks/[id]/attachments/route.js` and `src/components/boards/TaskEditModal.jsx`

**Features**:
- Drag-and-drop file upload
- Click to browse file selection
- File size validation (max 10MB)
- File type validation (images, PDFs, Office documents, text files)
- Attachment display with download links
- Delete attachments functionality
- Files stored in `public/uploads/attachments/`

**Usage**:
1. Open a task in the Kanban board
2. Scroll to the "Attachments" section
3. Drag and drop a file or click "Select File"
4. Files are automatically uploaded and attached to the task
5. Click on an attachment name to download
6. Hover over an attachment and click the X icon to delete

**API Endpoints**:
- `POST /api/tasks/[id]/attachments` - Upload a file
- `DELETE /api/tasks/[id]/attachments?url=<attachmentUrl>` - Delete an attachment

### 2. Deadline Reminder Emails ✅

**Location**: `src/app/api/cron/deadline-reminders/route.js`

**Features**:
- Automatically checks for tasks with approaching deadlines
- Sends email notifications to task assignees
- Checks tasks due within 24-48 hours (to avoid duplicates)
- Also checks tasks due within 6 hours (urgent reminders)
- Respects user notification preferences
- Only notifies users who have email notifications enabled

**Setup**:
1. Add `CRON_SECRET` to your `.env.local` file
2. Set up a cron job to call this endpoint every 6 hours

**Cron Job Examples**:

**Vercel Cron** (add to `vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/cron/deadline-reminders",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**GitHub Actions** (`.github/workflows/deadline-reminders.yml`):
```yaml
name: Deadline Reminders
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  remind:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Deadline Reminders
        run: |
          curl -X POST https://your-domain.com/api/cron/deadline-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**Manual Testing**:
```bash
curl -X POST http://localhost:3000/api/cron/deadline-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**How It Works**:
1. Finds tasks with due dates between 24-48 hours from now
2. Finds tasks with due dates within the next 6 hours
3. For each task, checks assignees' notification preferences
4. Sends email notifications using the `notifyDeadlineApproaching` function
5. Returns a summary of notifications sent

### 3. File Storage

**Location**: `public/uploads/attachments/`

**Note**: The `public/uploads` directory is added to `.gitignore` to prevent committing user-uploaded files.

**For Production**: Consider using cloud storage (AWS S3, Cloudinary, etc.) instead of local file storage. Update the file upload API to upload to your cloud storage provider.

## Environment Variables

Add these to your `.env.local`:

```env
# Email Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Tasklyx <your-email@domain.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Job Security
CRON_SECRET=your_random_secret_string
```

## Testing

### Test File Upload:
1. Create or open a task
2. Try uploading different file types (images, PDFs, documents)
3. Verify files appear in the attachments list
4. Test file deletion
5. Check that files are saved in `public/uploads/attachments/`

### Test Deadline Reminders:
1. Create a task with a due date 1-2 days in the future
2. Assign yourself to the task
3. Ensure email notifications are enabled in your user settings
4. Manually trigger the cron endpoint or wait for the scheduled run
5. Check your email for the deadline reminder

## Notes

- File uploads are limited to 10MB per file
- Allowed file types: images (JPEG, PNG, GIF, WebP), PDFs, Office documents (Word, Excel), text files (TXT, CSV)
- Deadline reminders respect user notification preferences
- Files are stored locally in development. For production, consider cloud storage.

