# PowerShell script to fix JSX formatting in modal files
$files = @(
    "src/components/Modals/CreateWorkflowModal.tsx",
    "src/components/Modals/EditAppointmentModal.tsx", 
    "src/components/Modals/EditCampaignModal.tsx",
    "src/components/Modals/EditCommunicationModal.tsx",
    "src/components/Modals/EditEmployeeModal.tsx",
    "src/components/Modals/EditInventoryItemModal.tsx",
    "src/components/Modals/EditMaintenanceRequestModal.tsx",
    "src/components/Modals/EditProjectModal.tsx",
    "src/components/Modals/EditPurchaseOrderModal.tsx",
    "src/components/Modals/EditTaskModal.tsx",
    "src/components/Modals/EditUserModal.tsx",
    "src/components/Modals/ScheduleAppointmentModal.tsx",
    "src/components/Modals/ScheduleMaintenanceModal.tsx",
    "src/components/Modals/SendEmailModal.tsx",
    "src/components/Modals/SendSMSModal.tsx",
    "src/components/Modals/ViewAppointmentModal.tsx",
    "src/components/Modals/ViewCommunicationModal.tsx",
    "src/components/Modals/ViewInventoryItemModal.tsx",
    "src/components/Modals/ViewLeadModal.tsx",
    "src/components/Modals/ViewMaintenanceRequestModal.tsx",
    "src/components/Modals/ViewPurchaseOrderModal.tsx",
    "src/components/Modals/ViewUserModal.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..."
        $content = Get-Content $file -Raw
        
        # Replace the long single-line JSX with multi-line format
        $oldPattern = 'className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-\w+ w-full max-h-\[90vh\] overflow-y-auto" role="dialog" aria-modal="true" onClick=\{\(e\) => e\.stopPropagation\(\)\}'
        $newReplacement = @"
className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-`$1 w-full max-h-[90vh] overflow-y-auto" 
        role="dialog" 
        aria-modal="true" 
        onClick={(e) => e.stopPropagation()}
"@
        
        # Use regex to match and replace
        $content = $content -replace 'className="(bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-[\w-]+) w-full max-h-\[90vh\] overflow-y-auto" role="dialog" aria-modal="true" onClick=\{\(e\) => e\.stopPropagation\(\)\}', @"
className="`$1 w-full max-h-[90vh] overflow-y-auto" 
        role="dialog" 
        aria-modal="true" 
        onClick={(e) => e.stopPropagation()}
"@
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed $file"
    }
}

Write-Host "All modal files have been fixed!"
