# Shared Components

Reusable presentational components used across multiple features.
Built on top of shadcn/ui components for consistency and maintainability.

## Available Components

### StatCard
Displays a statistic with an icon, title, value, and optional description.
Uses shadcn Card component internally.

**Usage:**
```tsx
import { StatCard } from "@/components/shared"
import { Users } from "lucide-react"

<StatCard
  title="Total Users"
  value={100}
  icon={Users}
  description="+10% from last month"
/>
```

---

### DataTable
Generic table component for displaying tabular data with type safety.
Built using shadcn Table components for consistent styling.

**Usage:**
```tsx
import { DataTable } from "@/components/shared"
import { Badge } from "@/components/ui/badge"

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  {
    header: "Status",
    accessor: (item) => <Badge>{item.status}</Badge>
  }
]

<DataTable data={items} columns={columns} />
```

---

### DataTableWithFilters ⭐ NEW
Advanced table component with built-in search, filtering, and pagination.
Perfect for lists with many items that need to be filtered and searched.

**Features:**
- 🔍 **Search** - Free text search across multiple columns
- 🎯 **Filters** - Dropdown filters for specific fields
- 📄 **Pagination** - Automatic pagination with page size control
- 🧹 **Clear filters** - Easy reset button
- 📊 **Results counter** - Shows filtered vs total results

**Props:**
```typescript
interface DataTableWithFiltersProps<T> {
  data: T[]                          // Your data array
  columns: Column<T>[]               // Table columns definition
  searchableColumns?: (keyof T)[]    // Columns to search in
  filters?: FilterConfig[]           // Filter dropdowns
  pageSize?: number                  // Items per page (default: 10)
}
```

**Usage Example:**
```tsx
import { DataTableWithFilters } from "@/components/shared"
import { Badge } from "@/components/ui/badge"

const employees = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    status: "active"
  },
  // ... more data
]

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Role", accessor: "role" },
  {
    header: "Status",
    accessor: (item) => (
      <Badge variant={item.status === "active" ? "default" : "outline"}>
        {item.status}
      </Badge>
    )
  }
]

<DataTableWithFilters
  data={employees}
  columns={columns}
  searchableColumns={["name", "email"]}
  filters={[
    {
      placeholder: "Filter by status",
      accessor: "status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      placeholder: "Filter by role",
      accessor: "role",
      options: [
        { value: "Developer", label: "Developer" },
        { value: "Designer", label: "Designer" },
      ],
    },
  ]}
  pageSize={10}
/>
```

**Advanced Example (Multiple Filters):**
```tsx
<DataTableWithFilters
  data={appointments}
  columns={columns}
  searchableColumns={["client", "employee", "service"]}
  filters={[
    {
      placeholder: "Filter by status",
      accessor: "status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      placeholder: "Filter by service",
      accessor: "service",
      options: [
        { value: "Haircut", label: "Haircut" },
        { value: "Massage", label: "Massage" },
      ],
    },
  ]}
  pageSize={7}
/>
```

**When to use:**
- ✅ Lists with more than 10 items
- ✅ When users need to search/filter data
- ✅ Tables that need pagination
- ❌ Simple lists with few items (use DataTable instead)

---

### EmptyState
Shows a message when there's no data to display.

**Usage:**
```tsx
import { EmptyState } from "@/components/shared"
import { Inbox } from "lucide-react"

<EmptyState
  icon={Inbox}
  title="No results"
  description="Try adjusting your filters"
/>
```

---

## shadcn/ui Components Used

- **Card, CardContent, CardHeader, CardTitle** - For StatCard
- **Table, TableHeader, TableBody, TableRow, TableHead, TableCell** - For DataTable and DataTableWithFilters
- **Pagination** - For DataTableWithFilters
- **Input** - For search in DataTableWithFilters
- **Select** - For filters in DataTableWithFilters
- **Badge** - For status indicators
- **Button** - For actions
- **DropdownMenu** - For action menus
