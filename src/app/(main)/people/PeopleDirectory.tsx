"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User as UserIcon, ArrowRight } from "lucide-react";
import departments from "@/constants/departments";

interface Member {
  id: string;
  name: string;
  designation: string;
  buccDepartment: string;
  image: string | null;
  profileSlug: string;
  memberStatus: string;
  joinedBucc: string | null;
  bio?: string | null;
  currentJob?: string | null;
}

export default function PeopleDirectory({ initialMembers }: { initialMembers: Member[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.buccDepartment.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === "all" || member.buccDepartment === selectedDept;
      
      const matchesStatus = selectedStatus === "all" || 
        member.memberStatus?.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [initialMembers, searchQuery, selectedDept, selectedStatus]);

  return (
    <div className="space-y-12">
      {/* Title Header */}
      <div className="space-y-4 text-center md:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          BUCC Directory
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          People of BUCC
        </h1>
        <p className="text-muted-foreground text-sm font-light max-w-xl leading-relaxed">
          Meet the engineers, designers, and organizers pushing the boundaries of BRAC University's technology community.
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-y border-border/60 py-6">
        
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm focus-visible:outline-none focus:border-foreground/50 transition-colors font-light"
          />
        </div>

        {/* Department Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-sm text-sm focus-visible:outline-none focus:border-foreground/50 transition-colors font-light cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.title} value={dept.title}>
                {dept.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-sm text-sm focus-visible:outline-none focus:border-foreground/50 transition-colors font-light cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="alumni">Alumni</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredMembers.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border/80 rounded-sm bg-card/20">
          <p className="text-sm font-serif italic text-muted-foreground">No members found matching your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/m/${member.profileSlug.toLowerCase()}`}
              className="group flex flex-col justify-between border border-border hover:border-foreground/30 transition-all duration-300 p-5 bg-card rounded-sm"
            >
              <div className="space-y-4">
                {/* Avatar Box */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted border border-border/60 shrink-0">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs text-foreground/80 font-medium">
                    {member.designation}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-light">
                    {member.buccDepartment}
                  </p>
                  {member.currentJob && (
                    <p className="text-[10px] text-primary/80 font-medium tracking-wide font-sans mt-0.5">
                      {member.currentJob}
                    </p>
                  )}
                </div>

                {member.bio && (
                  <p className="text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed pt-1.5 border-t border-border/10">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Status Tag & View Link */}
              <div className="pt-5 mt-auto flex items-center justify-between border-t border-border/40 text-[10px]">
                <span className={`px-2 py-0.5 font-mono font-bold uppercase tracking-wider border rounded-full ${
                  member.memberStatus?.toLowerCase() === 'active' 
                    ? 'border-green-500/20 text-green-500 bg-green-500/5' 
                    : member.memberStatus?.toLowerCase() === 'alumni'
                    ? 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                    : 'border-muted-foreground/20 text-muted-foreground bg-muted-foreground/5'
                }`}>
                  {member.memberStatus}
                </span>
                
                <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  View Profile <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      <div className="text-right text-[10px] font-mono text-muted-foreground/60">
        Showing {filteredMembers.length} of {initialMembers.length} public profiles
      </div>
    </div>
  );
}
