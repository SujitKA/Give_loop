| ID | Feature | Steps | Expected Result | Actual Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC01 | Auth | Sign up with valid email/password | Account created, redirected to home | As expected | ✅ Pass |
| TC02 | Auth | Login with invalid credentials | Error message displayed | As expected | ✅ Pass |
| TC03 | Auth | Attempt to access dashboard without login | Redirected to sign-in page | As expected | ✅ Pass |
| TC04 | Browse | Search by valid keyword | Items containing keyword displayed | As expected | ✅ Pass |
| TC05 | Browse | Filter by category | Only items in category shown | As expected | ✅ Pass |
| TC06 | Item Detail | View available item | Full details and request button shown | As expected | ✅ Pass |
| TC07 | Donate | Form validation (empty title) | Validation error shown | As expected | ✅ Pass |
| TC08 | Donate | Upload > 4 images | Error message shown | As expected | ✅ Pass |
| TC09 | Donate | Upload valid images + submit | Item listing created, redirected | As expected | ✅ Pass |
| TC10 | Request | Send request with message | Request sent, status "pending" | As expected | ✅ Pass |
| TC11 | Requests | Accept request as donor | Item marked "Reserved", contact shown | As expected | ✅ Pass |
| TC12 | Requests | Decline request as donor | Request marked "declined" | As expected | ✅ Pass |
| TC13 | Security | Try to update someone else's item | Server-side error/forbidden | As expected | ✅ Pass |
| TC14 | Security | Try to view private request details | Access denied | As expected | ✅ Pass |
| TC15 | Report | Submit report for listing | Report recorded, admin_flag set | As expected | ✅ Pass |
| TC16 | UI/UX | Toggle dark mode | UI theme updates correctly | As expected | ✅ Pass |
| TC17 | UI/UX | View on mobile device | Responsive layout, menu works | As expected | ✅ Pass |
| TC18 | UI/UX | Empty state (no items) | "No items found" message shown | As expected | ✅ Pass |
| TC19 | Performance | Load browse page | Fast load, skeletons visible | As expected | ✅ Pass |
| TC20 | Flow | Full Give->Request->Accept cycle | End-to-end success | As expected | ✅ Pass |
