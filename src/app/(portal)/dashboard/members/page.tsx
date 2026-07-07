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
import { isGoverningBody as checkGB, isSuperUser } from "@/lib/permissions";
import MemberEditDialog from "@/components/portal/members/MemberEditDialog";
import MemberApprovalDialog from "@/components/portal/members/MemberApprovalDialog";
 
const getMembers = async () => {
  const res = await fetch(`/api/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
};
 
export default function MembersPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<"directory" | "pending">("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    designation: "",
    department: "",
  });
 
  // Editor State for Active Members
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
 
  // Editor State for Pending Requests
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
 
  const { data, isLoading, isError } = useQuery({
    queryKey: ["members-list"],
    queryFn: getMembers,
    enabled: sessionStatus === "authenticated",
  });
 
  const user = session?.user as any;
  const isGB = user ? checkGB(user) : false;
  const isSuper = user ? isSuperUser(user) : false;
  const isAlumni = user?.memberStatus === "Alumni";
 
  // Only Active Director, AD, or GB/R&D members can review/approve registrations
  const canApprove = user && !isAlumni && (
    isSuper || ["Director", "Assistant Director"].includes(user.designation)
  );
 
  // Fetch pending registrations list
  const { data: pendingData, isLoading: isPendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ["pending-registrations-list"],
    queryFn: async () => {
      const res = await fetch("/api/member-registration");
      if (!res.ok) throw new Error("Failed to fetch pending registration requests");
      return res.json();
    },
    enabled: sessionStatus === "authenticated" && !!canApprove,
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
 
  // Columns for the pending approvals list
  const pendingColumns = [
    { header: "Student ID", accessorKey: "studentId" },
    { header: "Name", accessorKey: "name" },
    { header: "Requested Designation", accessorKey: "designation" },
    { header: "Requested Department", accessorKey: "buccDepartment" },
    { header: "Phone", accessorKey: "phoneNumber" },
    { 
      header: "Status", 
      accessorKey: "memberStatus",
      cell: ({ getValue }: { getValue: () => string }) => {
        const status = getValue() || "Active";
        return <Badge variant={status === "Active" ? "Active" : "Alumni"}>{status === "Active" ? "Current Member" : "Alumni"}</Badge>;
      }
    },
    { 
      header: "Submission Date", 
      accessorKey: "createdAt",
      cell: ({ getValue }: { getValue: () => string }) => {
        return new Date(getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
    }
  ];
 
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
 
  // Only GB and EB (Directors/Assistant Directors) can view the Member Directory
  const isAuthorized = user && !isAlumni && [
    "President", "Vice President", "General Secretary", "Treasurer",
    "Director", "Assistant Director"
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
 
      {/* Custom Premium Tabs Layout */}
      {canApprove && (
        <div className="flex border-b border-border gap-6">
          <button 
            onClick={() => setActiveTab("directory")} 
            className={`pb-4 text-sm font-medium border-b-2 transition-all relative ${
              activeTab === "directory" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Active Directory
          </button>
          <button 
            onClick={() => setActiveTab("pending")} 
            className={`pb-4 text-sm font-medium border-b-2 transition-all relative ${
              activeTab === "pending" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Registrations
            {pendingData?.requests?.length > 0 && (
              <span className="absolute -top-1.5 -right-4 bg-primary text-primary-foreground text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                {pendingData.requests.length}
              </span>
            )}
          </button>
        </div>
      )}
 
      {activeTab === "directory" ? (
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
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {isPendingLoading ? (
            <div className="py-12">
              <SpinnerComponent />
            </div>
          ) : (
            <>
              <TableComponent
                data={pendingData?.requests || []}
                columns={pendingColumns}
                onRowClick={(row) => {
                  setSelectedRequest(row);
                  setIsApprovalOpen(true);
                }}
              />
 
              {(pendingData?.requests || []).length === 0 && (
                <div className="p-12 text-center border border-dashed border-border rounded-md">
                  <p className="text-muted-foreground">No pending member registrations to review.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
 
      {/* Profile Editor for Active Users */}
      {selectedMember && (
        <MemberEditDialog 
          member={selectedMember}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ["members-list"] })}
        />
      )}
 
      {/* Registration Request Approval Dialog */}
      {selectedRequest && (
        <MemberApprovalDialog
          request={selectedRequest}
          isOpen={isApprovalOpen}
          onClose={() => setIsApprovalOpen(false)}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ["members-list"] });
            refetchPending();
          }}
        />
      )}
    </div>
  );
}
