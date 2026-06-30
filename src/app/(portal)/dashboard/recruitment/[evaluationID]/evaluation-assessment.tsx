"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { departmentsInfo } from "@/constants/departments";
import EBs from "@/constants/ebs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const EB_OPTIONS: Option[] = EBs.map((eb: any) => ({
  label: eb.fullName,
  value: eb.fullName,
}));

export default function EvaluationAssessment({ evaluationData }: any) {
  const { data: session } = useSession();
  const params = useParams();
  const evaluationID = params.evaluationID;

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(evaluationData.buccDepartment || "");
  const [status, setStatus] = useState(evaluationData.status || "Pending");
  const [comment, setComment] = useState(evaluationData.comment || "");
  const [selectedEBs, setSelectedEBs] = useState<Option[]>(
    evaluationData.interviewTakenBy?.map((eb: string) => ({
      label: eb,
      value: eb,
    })) || []
  );

  async function submitAssessment() {
    setLoading(true);
    try {
      const assessmentData = {
        _id: evaluationID,
        interviewTakenBy: selectedEBs.map((eb) => eb.value),
        modifiedBy: session?.user?.name,
        assignedDepartment: department,
        status,
        comment,
      };

      const response = await fetch(`/api/evaluation`, {
        method: "PATCH",
        body: JSON.stringify(assessmentData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Assessment updated successfully.");
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update assessment.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-card border-border shadow-none">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-10 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending (Post-Interview)</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assign Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full h-10 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsInfo.map((dept) => (
                  <SelectItem key={dept.name} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Interviewers</Label>
            <MultipleSelector
              value={selectedEBs}
              onChange={setSelectedEBs}
              defaultOptions={EB_OPTIONS}
              placeholder="Type to search EBs..."
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-muted-foreground">
                  No EB found.
                </p>
              }
              className="bg-transparent border-0 border-b border-border rounded-none px-0 min-h-[40px] focus-within:border-primary transition-colors"
              badgeClassName="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Select multiple members who conducted the interview.</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Comments</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Internal notes..."
              className="min-h-[250px] bg-transparent border border-border rounded-sm focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm resize-y p-3"
            />
          </div>
        </div>

        <LoadingButton
          onClick={submitAssessment}
          disabled={loading}
          loading={loading}
          className="w-full bg-foreground text-background py-6 font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Update Assessment
        </LoadingButton>

        {evaluationData.modifiedBy && (
          <p className="text-[10px] text-center text-muted-foreground italic">
            Last modified by {evaluationData.modifiedBy}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
