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

## shadcn/ui Components Used

- **Card, CardContent, CardHeader, CardTitle** - For StatCard
- **Table, TableHeader, TableBody, TableRow, TableHead, TableCell** - For DataTable
- **Badge** - For status indicators
- **Button** - For actions
- **DropdownMenu** - For action menus
