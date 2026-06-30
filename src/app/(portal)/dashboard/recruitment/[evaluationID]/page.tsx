"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import { json as evaluationJson } from "@/components/evaluation/questionJSON";
import Heading from "@/components/portal/heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import EvaluationAssessment from "./evaluation-assessment";

type EvaluationData = {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  bracuDepartment: string;
  buccDepartment: string;
  status: string;
  comment?: string;
  responseObject: any;
  submissionDate: string;
  interviewTakenBy?: string[];
};

export default function EvaluationDetailPage() {
  const params = useParams();
  const evaluationID = params.evaluationID as string;
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await fetch(`/api/evaluation?evaluationID=${evaluationID}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvaluation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvaluation();
  }, [evaluationID]);

  if (isLoading) return <SpinnerComponent />;
  if (!evaluation) return <div className="p-8 text-center">Evaluation not found.</div>;

  const responses = typeof evaluation.responseObject === "string" 
    ? JSON.parse(evaluation.responseObject) 
    : evaluation.responseObject;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <Heading 
            headingText="Evaluation Details" 
            subHeadingText={`Reviewing submission from ${evaluation.name}`} 
          />
        </div>
        <Badge variant={evaluation.status}>
          {evaluation.status || "Pending"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Response Feed */}
        <div className="lg:col-span-2 space-y-12">
          {evaluationJson.pages.map((page: any, pIdx: number) => {
            const visibleElements = page.elements.filter((el: any) => {
              const val = responses[el.name];
              return val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : true);
            });

            if (visibleElements.length === 0) return null;

            return (
              <section key={pIdx} className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-medium text-foreground tracking-tight">{page.title || page.name}</h3>
                  {page.description && <p className="text-xs text-muted-foreground italic font-light">{page.description}</p>}
                </div>
                
                <div className="space-y-8 pl-4 border-l border-border/50">
                  {visibleElements.map((el: any, eIdx: number) => {
                    const answer = responses[el.name];
                    const answerComment = responses[`${el.name}-Comment`];

                    return (
                      <div key={eIdx} className="space-y-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">{el.title}</h4>
                        <div className="text-lg font-serif font-light text-foreground leading-relaxed">
                          {Array.isArray(answer) ? (
                            <div className="flex flex-wrap gap-2">
                              {answer.map((a, i) => (
                                <span key={i} className="px-2 py-0.5 bg-muted border border-border rounded text-sm font-sans font-medium">
                                  {a}
                                </span>
                              ))}
                            </div>
                          ) : typeof answer === "boolean" ? (
                            <span>{answer ? "Yes" : "No"}</span>
                          ) : (
                            <p className="whitespace-pre-wrap">{answer}</p>
                          )}
                          {answerComment && (
                            <p className="mt-2 text-sm text-muted-foreground italic bg-muted/30 p-2 rounded border-l-2 border-primary/20">
                              Specified: {answerComment}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right: Assessment Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Admin Assessment</h3>
              <EvaluationAssessment evaluationData={evaluation} />
            </section>

            <section className="p-6 rounded-md border border-border bg-card space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Student Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student ID</span>
                  <span className="font-medium">{evaluation.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{evaluation.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{evaluation.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">University Dept</span>
                  <span className="font-medium">{evaluation.bracuDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted on</span>
                  <span className="font-medium">{new Date(evaluation.submissionDate).toLocaleDateString()}</span>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
