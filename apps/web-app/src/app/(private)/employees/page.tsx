"use client";

import { useTranslation } from "@/client/i18n";
import { EmployeeList } from "@/client/features/employees/components/employee-list";

export default function EmployeesPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">
          {t.pages.employees.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.pages.employees.employeeList}
        </p>
      </div>
      <EmployeeList />
    </div>
  );
}
