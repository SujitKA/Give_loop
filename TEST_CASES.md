| ID | Feature | Steps | Expected Result | Actual Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC01 | Auth | Sign up with valid email/password | Account created, redirected to home | | |
| TC02 | Auth | Login with invalid credentials | Error message displayed | | |
| TC03 | Auth | Attempt to access dashboard without login | Redirected to sign-in page | | |
| TC04 | Browse | Search by valid keyword | Items containing keyword displayed | | |
| TC05 | Browse | Filter by category | Only items in category shown | | |
| TC06 | Item Detail | View available item | Full details and request button shown | | |
| TC07 | Donate | Form validation (empty title) | Validation error shown | | |
| TC08 | Donate | Upload > 4 images | Error message shown | | |
| TC09 | Donate | Upload valid images + submit | Item listing created, redirected | | |
| TC10 | Request | Send request with message | Request sent, status "pending" | | |
| TC11 | Requests | Accept request as donor | Item marked "Reserved", contact shown | | |
| TC12 | Requests | Decline request as donor | Request marked "declined" | | |
| TC13 | Security | Try to update someone else's item | Server-side error/forbidden | | |
| TC14 | Security | Try to view private request details | Access denied | | |
| TC15 | Report | Submit report for listing | Report recorded, admin_flag set | | |
| TC16 | UI/UX | Toggle dark mode | UI theme updates correctly | | |
| TC17 | UI/UX | View on mobile device | Responsive layout, menu works | | |
| TC18 | UI/UX | Empty state (no items) | "No items found" message shown | | |
| TC19 | Performance | Load browse page | Fast load, skeletons visible | | |
| TC20 | Flow | Full Give->Request->Accept cycle | End-to-end success | | |
