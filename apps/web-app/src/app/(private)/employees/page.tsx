"use client";

import { useTranslation } from "@/i18n";
import { EmployeeList } from "@/features/employees/components/employee-list";

export default function EmployeesPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.employees.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.pages.employees.employeeList}
        </p>
      </div>
      <EmployeeList />
    </div>
  );
}
