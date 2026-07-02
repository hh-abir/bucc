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
import { Button } from "@/components/ui/button";
import { departmentsInfo } from "@/constants/departments";
import EBs from "@/constants/ebs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, ExternalLink, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

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

  const [config, setConfig] = useState<any>(null);
  const [defaultTasks, setDefaultTasks] = useState<any>({});
  const [assignedTasks, setAssignedTasks] = useState<any[]>(evaluationData.assignedTasks || []);

  // Form state for assigning a task
  const [taskDept, setTaskDept] = useState("Creative");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  const user = session?.user as any;
  const userDept = user?.buccDepartment || "";
  const userDesignation = user?.designation || "";

  const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(userDesignation);
  const isRDAdmin = userDept === "Research and Development" && ["Director", "Assistant Director"].includes(userDesignation);
  const isSuper = isGB || isRDAdmin;

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [configRes, tasksRes] = await Promise.all([
          fetch("/api/config?key=recruitment_config"),
          fetch("/api/config?key=recruitment_default_tasks")
        ]);
        const configJson = await configRes.json();
        const tasksJson = await tasksRes.json();
        setConfig(configJson.value || { allowSERecruitmentAccess: false });
        setDefaultTasks(tasksJson.value || {});
      } catch (err) {
        console.error("Failed to load configs", err);
      }
    };
    fetchConfigs();
  }, []);

  // Set initial task department based on user department if not superadmin
  useEffect(() => {
    if (!isSuper && userDept && userDept !== "Governing Body") {
      setTaskDept(userDept);
    }
  }, [userDept, isSuper]);

  const canViewTask = (deptName: string) => {
    if (isSuper) return true;
    const isDeptHead = userDept === deptName && ["Director", "Assistant Director"].includes(userDesignation);
    const isSE = userDept === deptName && userDesignation === "Senior Executive" && config?.allowSERecruitmentAccess;
    return isDeptHead || isSE;
  };

  const handleAssignTask = () => {
    if (!taskTitle || !taskDesc) {
      toast.error("Task Title and Description are required");
      return;
    }
    // Check if task for this department is already assigned
    const exists = assignedTasks.some(t => t.department === taskDept);
    if (exists) {
      toast.error(`A task for the ${taskDept} department is already assigned.`);
      return;
    }

    const newTask = {
      department: taskDept,
      title: taskTitle,
      description: taskDesc,
      status: "pending"
    };

    setAssignedTasks([...assignedTasks, newTask]);
    setTaskTitle("");
    setTaskDesc("");
    toast.success("Task added locally. Click 'Update Assessment' to save.");
  };

  const handleDeleteTask = (deptName: string) => {
    setAssignedTasks(assignedTasks.filter(t => t.department !== deptName));
    toast.success("Task removed locally. Click 'Update Assessment' to save.");
  };

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
        assignedTasks,
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

  // Load standard department list filtered by user authorization
  const assignableDepts = isSuper 
    ? departmentsInfo.map(d => d.name)
    : departmentsInfo.map(d => d.name).filter(name => name === userDept);

  const defaultTask1 = defaultTasks[taskDept]?.[0];
  const defaultTask2 = defaultTasks[taskDept]?.[1];

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
              className="min-h-[150px] bg-transparent border border-border rounded-sm focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm resize-y p-3"
            />
          </div>

          {/* Assigned Tasks Section */}
          <div className="pt-4 border-t border-border/50 space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assigned Tasks</Label>
            {assignedTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {assignedTasks.map((task) => {
                  const visible = canViewTask(task.department);
                  return (
                    <div key={task.department} className="border border-border rounded-md p-3 space-y-2 bg-muted/10 relative">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                            {task.department}
                          </span>
                          <h4 className="text-xs font-bold mt-1 text-foreground">
                            {visible ? task.title : "Task details hidden"}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.department)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Unassign task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {visible ? (
                        <>
                          <p className="text-[11px] text-muted-foreground font-light line-clamp-3">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[10px]">
                            <span className={`font-semibold ${task.status === "submitted" ? "text-emerald-600" : "text-amber-600"}`}>
                              {task.status === "submitted" ? "Submitted" : "Pending"}
                            </span>
                            {task.status === "submitted" && (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={task.driveLink} 
                                  target="_blank" 
                                  className="text-primary flex items-center gap-0.5 hover:underline"
                                >
                                  Drive <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                                {task.githubLink && (
                                  <a 
                                    href={task.githubLink} 
                                    target="_blank" 
                                    className="text-primary flex items-center gap-0.5 hover:underline"
                                  >
                                    GitHub <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground italic pt-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <span>Only visible to {task.department} department panel.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Task Assignment Form */}
          {assignableDepts.length > 0 && (
            <div className="pt-4 border-t border-border/50 space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assign New Task</Label>
              
              <div className="space-y-3 bg-muted/20 p-4 rounded-md border border-border/50">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">For Department</Label>
                  {isSuper ? (
                    <select
                      value={taskDept}
                      onChange={(e) => setTaskDept(e.target.value)}
                      className="w-full px-3 py-1.5 border border-border rounded-md bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-sans"
                    >
                      {departmentsInfo.map(d => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs font-medium px-3 py-1.5 bg-muted rounded border border-border text-foreground font-sans">
                      {userDept}
                    </div>
                  )}
                </div>

                {/* Default tasks quick-assign buttons */}
                {(defaultTask1?.title || defaultTask2?.title) && (
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Quick Assign Default Tasks</Label>
                    <div className="flex flex-col gap-2">
                      {defaultTask1?.title && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 justify-start text-[10px] font-sans border-border"
                          onClick={() => {
                            setTaskTitle(defaultTask1.title);
                            setTaskDesc(defaultTask1.description);
                          }}
                        >
                          <FileText className="w-3 h-3 mr-2 text-primary" /> {defaultTask1.title}
                        </Button>
                      )}
                      {defaultTask2?.title && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 justify-start text-[10px] font-sans border-border"
                          onClick={() => {
                            setTaskTitle(defaultTask2.title);
                            setTaskDesc(defaultTask2.description);
                          }}
                        >
                          <FileText className="w-3 h-3 mr-2 text-primary" /> {defaultTask2.title}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Title</Label>
                  <Input
                    placeholder="e.g. Design Recruitment Poster"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="h-8 bg-background border-border text-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Description</Label>
                  <Textarea
                    placeholder="Task details and expectations..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="min-h-[80px] bg-background border-border text-xs resize-none p-2 font-sans"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-[10px] font-bold uppercase tracking-wider"
                  onClick={handleAssignTask}
                >
                  Add Assignment
                </Button>
              </div>
            </div>
          )}
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
