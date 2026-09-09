# Product Specification: Mini Kanban MVP (PicoBoard)

## 1. Overview
A lean, single-user task management application built as a proof of concept. The application provides an essential three-column workflow, basic task organization, lightweight drag-and-drop interactions, and a persistent chronological archive for completed tasks.

---

## 2. Views & Navigation
The header contains a simple segmented toggle between two primary views:
* **BOARD (Primary):** Large, prominent view button. Displays the active Kanban columns.
* **Archive (Secondary):** Compact text button. Displays historical completed tasks.

---

## 3. Data Model

### Task Entity
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String / UUID | Unique task identifier |
| `title` | String | Task title (Required) |
| `description` | String | Plain-text details (Optional) |
| `column` | Enum | `todo` \| `in_progress` \| `done` |
| `due_date` | Date / Null | Optional due date (YYYY-MM-DD) |
| `is_hot` | Boolean | Flag for high-priority items (Default: `false`) |
| `order` | Integer | Vertical position within the column |
| `archived_at` | Timestamp / Null | Date and time the card was archived; `null` if active |

---

## 4. Board View

### Fixed Columns
The board has exactly three fixed columns:
1. **To Do**
2. **In Progress**
3. **Done**

*Note: Custom column creation, renaming, and column deletion are explicitly out of scope.*

### Card Attributes & Badges
* **Title:** Displayed clearly on the card face.
* **Badges:**
  * `🔥 HOT`: Rendered only when `is_hot` is true.
  * `Overdue`: Automatically displayed in red when `due_date < current_date` AND column is NOT `Done`.
* **Done Column Behavior:**
  * Cards moved to `Done` immediately clear the `Overdue` badge, even if past due.
  * An **Archive** button appears directly on cards in the `Done` column.
* **Delete Action:** A trash can icon is visible on every card. Clicking it immediately removes the card from persistence without a confirmation prompt.

---

## 5. User Interactions & Workflows

### Creating Tasks
* A global **"+ Add Task"** button is located at the top of the board.
* Clicking opens a minimal modal with:
  * Title (required)
  * Description (optional)
  * Due Date picker (optional)
  * "HOT" checkbox / toggle (optional)
* Newly created tasks always initialize in the **To Do** column at the top of the stack.

### Editing Tasks
* Clicking on any card opens an edit modal populated with the task's current values.
* Saving updates the task in place.

### Moving & Reordering
* **Cross-column:** Tasks can be dragged and dropped freely across `To Do`, `In Progress`, and `Done`.
* **Within-column:** Tasks can be dragged vertically to reorder ranking (`order` index updates).
* *MVP Implementation Note:* Uses standard HTML5 Drag and Drop API or lightweight list reordering without heavy animation libraries.

### Archiving
* Only available on cards currently residing in the `Done` column.
* Clicking **Archive**:
  * Sets `archived_at = current_timestamp`.
  * Removes the task from the active Kanban board view.
  * Keeps the record in persistent storage for the Archive view.

---

## 6. Archive View

A simplified, read-only chronological log of retired work:
* **Display Elements:** Only the **Task Description** and **Archived Date** (e.g., `YYYY-MM-DD HH:mm`) are displayed.
  *(If description is empty, falls back to the Task Title to avoid blank entries).*
* **Sorting:** Strict descending order (newest archived items at the top).
* **Actions:** Read-only. Restoring tasks back to the board is out of scope for the MVP.

---

## 7. MVP Scope Exclusions (Cut for Dev Speed)
To minimize token usage, implementation overhead, and maintenance cost, the following are omitted from this MVP:
* User accounts, authentication, and multi-tenancy.
* Custom columns, color coding, or user-defined priority levels (beyond `HOT`).
* Confirmation dialogs for deletions.
* Search bars, live text filters, and complex column-level sorting controls.
* Undo/redo history or activity logs.