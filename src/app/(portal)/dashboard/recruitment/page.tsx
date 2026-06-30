"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import { departmentsInfo } from "@/constants/departments";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import EvaluationStats from "./EvaluationStats";
import { useRouter } from "next/navigation";

const getEvaluations = async () => {
  const res = await fetch(`/api/evaluation/all`);
  if (!res.ok) throw new Error("Failed to fetch evaluations");
  return res.json();
};

const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export default function EvaluationsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
  });

  const { data: evaluations, isLoading, isError } = useQuery({
    queryKey: ["evaluations"],
    queryFn: getEvaluations,
    enabled: sessionStatus === "authenticated",
  });

  // Calculate stats based on fetched data
  const stats = useMemo(() => {
    const statusWise: any = {
      Accepted: {},
      Pending: {},
      Rejected: {},
    };

    departmentsInfo.forEach(dept => {
      statusWise.Accepted[dept.name] = 0;
      statusWise.Pending[dept.name] = 0;
      statusWise.Rejected[dept.name] = 0;
    });

    evaluations?.forEach((item: any) => {
      const dept = item.buccDepartment || "Not Assigned";
      const status = item.status || "Pending";
      if (statusWise[status]) {
        statusWise[status][dept] = (statusWise[status][dept] || 0) + 1;
      }
    });

    return statusWise;
  }, [evaluations]);

  // Filter evaluations
  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return [];

    return evaluations.filter((item: any) => {
      const searchStr = filters.search.toLowerCase();
      const matchesSearch = 
        !filters.search || 
        item.name.toLowerCase().includes(searchStr) || 
        item.studentId.toString().toLowerCase().includes(searchStr);
      
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesDept = !filters.department || item.buccDepartment === filters.department;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [evaluations, filters]);

  const columns = [
    { header: "Student ID", accessorKey: "studentId" },
    { header: "Name", accessorKey: "name" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }: { getValue: () => string }) => {
        const status = getValue() || "Pending";
        return (
          <Badge 
            variant="outline" 
            className={
              status === "Accepted" ? "border-green-500/50 text-green-600 bg-green-50/50" : 
              status === "Rejected" ? "border-red-500/50 text-red-600 bg-red-50/50" : 
              "border-yellow-500/50 text-yellow-600 bg-yellow-50/50"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    { header: "Department", accessorKey: "buccDepartment" },
    { 
      header: "Submission", 
      accessorKey: "submissionDate",
      cell: ({ getValue }: { getValue: () => string }) => {
        return getValue() ? new Date(getValue()).toLocaleDateString() : "N/A";
      }
    },
  ];

  const filterOptions = [
    {
      type: "search",
      name: "search",
      placeholder: "Search by ID or Name",
    },
    {
      type: "select",
      name: "status",
      placeholder: "All Statuses",
      options: ["Pending", "Accepted", "Rejected"],
    },
    {
      type: "select",
      name: "department",
      placeholder: "All Departments",
      options: departmentsInfo.map(d => d.name),
    },
  ];

  if (isLoading || sessionStatus === "loading") return <SpinnerComponent />;
  if (isError) return <div className="p-8 text-center text-destructive">Failed to load evaluations.</div>;

  const user = session?.user as any;
  const isPermitted = permittedDesignations.includes(user?.designation);

  if (!isPermitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view recruitment data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <Heading 
          headingText="Recruitment Evaluations" 
          subHeadingText="Manage and review applicant submissions." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Sidebar */}
        <aside className="lg:col-span-1">
          <EvaluationStats evaluationsStats={stats} />
        </aside>

        {/* Table & Filters */}
        <main className="lg:col-span-3 space-y-6">
          <FilterComponent
            filters={filterOptions}
            onFilterChange={(f) => setFilters(prev => ({ ...prev, ...f }))}
            onResetFilters={() => setFilters({ search: "", status: "", department: "" })}
          />
          
          <TableComponent
            data={filteredEvaluations}
            columns={columns}
            onRowClick={(row) => router.push(`/dashboard/recruitment/${row._id}`)}
          />
        </main>
      </div>
    </div>
  );
}
