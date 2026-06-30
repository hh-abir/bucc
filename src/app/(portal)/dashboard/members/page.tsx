"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import { departmentsInfo } from "@/constants/departments";
import designations from "@/constants/designations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { isGoverningBody as checkGB } from "@/lib/permissions";
import MemberEditDialog from "@/components/portal/members/MemberEditDialog";

const getMembers = async () => {
  const res = await fetch(`/api/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
};

export default function MembersPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    designation: "",
    department: "",
  });

  // Editor State
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["members-list"],
    queryFn: getMembers,
    enabled: sessionStatus === "authenticated",
  });

  const filteredMembers = useMemo(() => {
    if (!data?.users) return [];
    
    return data.users.filter((item: any) => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm || 
        item.name.toLowerCase().includes(searchStr) || 
        item.studentId.toString().toLowerCase().includes(searchStr);
      
      const matchesDesignation = !filters.designation || item.designation === filters.designation;
      const matchesDept = !filters.department || item.buccDepartment === filters.department;

      return matchesSearch && matchesDesignation && matchesDept;
    });
  }, [data, searchTerm, filters]);

  const columns = [
    { header: "Student ID", accessorKey: "studentId" },
    { header: "Name", accessorKey: "name" },
    { header: "Designation", accessorKey: "designation" },
    { header: "Department", accessorKey: "buccDepartment" },
    { header: "Phone", accessorKey: "phoneNumber" },
    { header: "Joined BUCC", accessorKey: "joinedBucc" },
    {
      header: "Status",
      accessorKey: "memberStatus",
      cell: ({ getValue }: { getValue: () => string }) => {
        const status = getValue() || "Active";
        return <Badge variant={status}>{status}</Badge>;
      },
    },
  ];

  const user = session?.user as any;
  const isGB = user ? checkGB(user) : false;

  const filterOptions = [
    {
      type: "search",
      name: "search",
      placeholder: "Search ID or Name",
    },
    {
      type: "select",
      name: "designation",
      placeholder: "All Designations",
      options: designations.map(d => d.title),
    },
    ...(isGB ? [{
      type: "select",
      name: "department",
      placeholder: "All Departments",
      options: departmentsInfo.map(d => d.name),
    }] : []),
  ];

  if (sessionStatus === "loading") return <SpinnerComponent />;

  const isAlumni = user?.memberStatus === "Alumni";
  const isAuthorized = user && !isAlumni && [
    "President", "Vice President", "General Secretary", "Treasurer",
    "Director", "Assistant Director", "Senior Executive"
  ].includes(user.designation);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view the Member Directory.</p>
      </div>
    );
  }

  if (isLoading) return <SpinnerComponent />;
  if (isError) return <div className="p-8 text-center text-destructive">Failed to load members.</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <Heading 
          headingText="Member Directory" 
          subHeadingText={isGB ? "Manage all BUCC members across all departments." : `Managing members of ${user?.buccDepartment} department.`} 
        />
      </div>

      <div className="space-y-6">
        <FilterComponent
          filters={filterOptions}
          onFilterChange={(f) => {
            if (f.search !== undefined) setSearchTerm(f.search);
            else setFilters(prev => ({ ...prev, ...f }));
          }}
          onResetFilters={() => {
            setSearchTerm("");
            setFilters({ designation: "", department: "" });
          }}
        />
        
        <TableComponent
          data={filteredMembers}
          columns={columns}
          onRowClick={(row) => {
            setSelectedMember(row);
            setIsEditorOpen(true);
          }}
        />

        {filteredMembers.length === 0 && (
          <div className="p-12 text-center border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">No members found.</p>
          </div>
        )}
      </div>

      {/* Profile Editor */}
      {selectedMember && (
        <MemberEditDialog 
          member={selectedMember}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ["members-list"] })}
        />
      )}
    </div>
  );
}
