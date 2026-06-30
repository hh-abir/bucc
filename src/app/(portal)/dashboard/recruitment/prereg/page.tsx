"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BRACUDepartments from "@/constants/BRACUDepartments";
import { getPreRegMember, getPreRegMembers } from "@/server/actions";
import withAuthorization from "@/util/withAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PreRegMember {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  bracuDepartment: string;
  buccDepartment: string;
  phoneNumber: string;
}

const permittedDepartment = "Human Resources";
const permittedDesignations = ["Director", "Assistant Director"];

const columns = [
  { header: "Student ID", accessorKey: "studentId" },
  { header: "Name", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "BRACU Department", accessorKey: "bracuDepartment" },
  { header: "BUCC Department", accessorKey: "buccDepartment" },
];

const filterOptions = [
  {
    type: "search",
    name: "search",
    placeholder: "Search by student ID or name",
  },
];


function PreRegMembers() {
  const [preregMemberData, setPreregMemberData] = useState<PreRegMember | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [filteredData, setFilteredData] = useState([]);

  const buccDepartments = [
    "Communication and Marketing",
    "Creative",
    "Event Management",
    "Finance",
    "Human Resources",
    "Press Release and Publications",
    "Research and Development",
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["preRegMembers"],
    queryFn: getPreRegMembers,
  });

  useEffect(() => {
    if (data && Array.isArray(data.users)) {
      const filtered = data.users.filter((item: any) => {
        const studentId = item.studentId.toString().toLowerCase();
        const search = filters.search.toLowerCase();

        return (
          !filters.search ||
          item.name.toLowerCase().includes(search) ||
          studentId.includes(search)
        );
      });

      setFilteredData(filtered);
    }
  }, [data, filters]);

  const handleFilterChange = (filter: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...filter }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "" });
  };

  const handleRowClick = async (row: any) => {
    try {
      const memberId = row._id;
      const member = await getPreRegMember(memberId);
      setPreregMemberData(member);
      setIsSheetOpen(true);
    } catch (error) {
      console.error("Failed to fetch member details:", error);
      toast.error("Failed to fetch member details");
    }
  };

  const handleSubmit = async () => {
    if (!preregMemberData) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/preregmembers/${preregMemberData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preregMemberData),
        },
      );

      if (response.ok) {
        toast.success("Changes saved successfully!");
        setIsSheetOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update member details.");
      }
    } catch (error) {
      console.error("Error updating member details:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <SpinnerComponent />;
  }

  if (isError) {
    return <div>Error fetching pre-registration members</div>;
  }

  return (
    <div className="">
      <Heading
        headingText="Pre-Registration Members"
        subHeadingText="All pre-registration members"
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <FilterComponent
            filters={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
          <TableComponent
            data={
              filteredData.length > 0 ||
              Object.values(filters).some((value) => value)
                ? filteredData
                : (data?.users || [])
            }
            columns={columns}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Member</SheetTitle>
            <SheetDescription>
              Update the details for this pre-registered member.
            </SheetDescription>
          </SheetHeader>
          {preregMemberData && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input
                    id="name"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    placeholder="Enter name"
                    value={preregMemberData.name}
                    onChange={(e) =>
                      setPreregMemberData((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                  />
                </div>

                {/* Student ID */}
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student ID</Label>
                  <Input
                    id="studentId"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    placeholder="Enter student ID"
                    value={preregMemberData.studentId}
                    onChange={(e) =>
                      setPreregMemberData((prev) =>
                        prev ? { ...prev, studentId: e.target.value } : null,
                      )
                    }
                  />
                </div>

                {/* G-Suite Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">G-Suite Email</Label>
                  <Input
                    id="email"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    placeholder="Enter email"
                    value={preregMemberData.email}
                    onChange={(e) =>
                      setPreregMemberData((prev) =>
                        prev ? { ...prev, email: e.target.value } : null,
                      )
                    }
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    placeholder="Enter phone number"
                    value={preregMemberData.phoneNumber}
                    onChange={(e) =>
                      setPreregMemberData((prev) =>
                        prev ? { ...prev, phoneNumber: e.target.value } : null,
                      )
                    }
                  />
                </div>

                {/* BRACU Department */}
                <div className="space-y-2">
                  <Label htmlFor="bracuDepartment" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">BRACU Department</Label>
                  <Select
                    value={preregMemberData.bracuDepartment}
                    onValueChange={(value) =>
                      setPreregMemberData((prev) =>
                        prev ? { ...prev, bracuDepartment: value } : null,
                      )
                    }
                  >
                    <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Select BRACU Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRACUDepartments.map((department) => (
                        <SelectItem
                          key={department.name}
                          value={department.name}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred BUCC Department */}
                <div className="space-y-2">
                  <Label htmlFor="buccDepartment" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preferred BUCC Department</Label>
                  <Select
                    value={preregMemberData.buccDepartment}
                    onValueChange={(value) =>
                      setPreregMemberData((prev) =>
                        prev ? { ...prev, buccDepartment: value } : null,
                      )
                    }
                  >
                    <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Select BUCC Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {buccDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sheet Footer */}
              <SheetFooter>
                <Button type="submit" className="w-full">Save Changes</Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Cancel
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default withAuthorization(PreRegMembers, {
  permittedDepartment,
  permittedDesignations,
});
