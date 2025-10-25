"use client";

import { useTranslation } from "@/i18n";
import { EmployeeStats } from "@/features/employees/components/employee-stats";
import { EmployeeList } from "@/features/employees/components/employee-list";
import { Button } from "@/components/ui/button";

export default function EmployeesPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.pages.employees.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.pages.employees.employeeList}
          </p>
        </div>
        <Button>{t.pages.employees.addEmployee}</Button>
      </div>
      <EmployeeStats />
      <EmployeeList />
    </div>
  );
}
