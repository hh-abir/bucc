"use client";

import { useState } from "react";
import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  Download, 
  Trash2, 
  UploadCloud, 
  FileJson, 
  FileSpreadsheet, 
  AlertTriangle,
  UserPlus,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { isSuperUser as checkGB } from "@/lib/permissions";

const MANAGEABLE_MODELS = [
  { name: "Members (All Data)", collection: "user", protected: true },
  { name: "Projects", collection: "projects", protected: true },
  { name: "Blogs", collection: "blogs", protected: true },
  { name: "Events", collection: "events", protected: true },
  { name: "Evaluations", collection: "evaluationdatas", protected: false },
  { name: "Pre-Reg Members", collection: "preregmembers", protected: false },
  { name: "PR/Press Releases", collection: "pressreleases", protected: false },
  { name: "Inquiries", collection: "inquiries", protected: false },
  { name: "Testimonials", collection: "testimonials", protected: false },
  { name: "Announcements", collection: "announcements", protected: false },
  { name: "Tasks", collection: "tasks", protected: false },
  { name: "Sessions (Live)", collection: "session", protected: true },
];

export default function ManageDataPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<"maintenance" | "bulk">("maintenance");
  const [loading, setLoading] = useState<string | null>(null);
  const [flushConfirm, setFlushConfirm] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  // Bulk Upload State
  const [jsonFile, setJsonFile] = useState<any[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onboardResults, setOnboardResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  if (sessionStatus === "loading") return <SpinnerComponent />;

  const user = session?.user as any;
  const isGB = user ? checkGB(user) : false;
  const isHRHead = user?.buccDepartment === "Human Resources" && ["Director", "Assistant Director"].includes(user?.designation);

  if (!isGB && !isHRHead) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to access data management tools.</p>
      </div>
    );
  }

  const handleDownload = async (collection: string, format: "csv" | "json") => {
    setLoading(`${collection}-${format}`);
    try {
      const res = await fetch(`/api/manage-data?model=${collection}&format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${collection}_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${format.toUpperCase()} export complete.`);
    } catch (err) {
      toast.error("Failed to export data.");
    } finally {
      setLoading(null);
    }
  };

  const handleFlush = async (collection: string) => {
    if (confirmInput !== collection) {
      toast.error("Collection name mismatch. Flush aborted.");
      return;
    }

    setLoading(`flush-${collection}`);
    try {
      const res = await fetch(`/api/manage-data?model=${collection}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setFlushConfirm(null);
        setConfirmInput("");
      } else {
        toast.error(data.error || "Flush failed");
      }
    } catch (err) {
      toast.error("An error occurred during flush.");
    } finally {
      setLoading(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) throw new Error("JSON must be an array of members.");
        setJsonFile(json);
        toast.success(`Loaded ${json.length} records. Ready to onboard.`);
      } catch (err: any) {
        toast.error(`Invalid JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const triggerBulkOnboard = async () => {
    if (!jsonFile) return;
    setIsUploading(true);
    setOnboardResults(null);
    try {
      const res = await fetch("/api/manage-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bulk-user", data: jsonFile }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Success: ${data.results.success}, Failed: ${data.results.failed}`);
        setOnboardResults(data.results);
        setJsonFile(null);
      } else {
        toast.error(data.error || "Bulk onboarding failed");
      }
    } catch (err) {
      toast.error("An error occurred during bulk onboarding.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <Heading 
        headingText="Data Management" 
        subHeadingText="Perform bulk operations and maintain system data integrity." 
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-8">
        <button 
          onClick={() => setActiveTab("maintenance")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "maintenance" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Maintenance
        </button>
        <button 
          onClick={() => setActiveTab("bulk")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "bulk" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Bulk Onboarding
        </button>
      </div>

      {activeTab === "maintenance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MANAGEABLE_MODELS.map((model) => (
            <Card key={model.collection} className="border-border shadow-none bg-card overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-serif">{model.name}</CardTitle>
                <CardDescription className="text-xs uppercase tracking-tight font-mono text-muted-foreground/60">{model.collection}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-10 gap-2 border-border"
                    onClick={() => handleDownload(model.collection, "json")}
                    disabled={!!loading}
                  >
                    <FileJson className="w-3.5 h-3.5" /> JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-10 gap-2 border-border"
                    onClick={() => handleDownload(model.collection, "csv")}
                    disabled={!!loading}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </Button>
                  {isGB && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-10 px-4 gap-2 ${model.protected ? "opacity-30 grayscale cursor-not-allowed border-border" : "border-destructive/20 text-destructive hover:bg-destructive hover:text-white"}`}
                      onClick={() => !model.protected && setFlushConfirm(model.collection)}
                      disabled={model.protected}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {model.protected ? "Protected" : "Flush"}
                    </Button>
                  )}
                </div>

                {flushConfirm === model.collection && (
                  <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-destructive font-bold text-[10px] uppercase tracking-widest">
                      <AlertTriangle className="w-3.5 h-3.5" /> Confirm Destruction
                    </div>
                    <p className="text-xs text-muted-foreground">Type <span className="font-mono text-foreground font-bold">{model.collection}</span> below to permanently erase all records.</p>
                    <Input 
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Type collection name..."
                      className="h-8 bg-transparent border-0 border-b border-destructive/30 rounded-none focus-visible:ring-0 focus-visible:border-destructive text-sm"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1 h-8 text-[10px] font-bold uppercase"
                        onClick={() => handleFlush(model.collection)}
                        disabled={loading === `flush-${model.collection}`}
                      >
                        {loading === `flush-${model.collection}` ? "Erasing..." : "I am sure, Flush Data"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-8 text-[10px] font-bold uppercase"
                        onClick={() => { setFlushConfirm(null); setConfirmInput(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Wipe All Recruitment Data Card */}
          <Card className="border-destructive/30 shadow-none bg-card overflow-hidden md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-serif text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Wipe All Recruitment Data
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-tight font-mono text-muted-foreground/60">
                recruitment_all
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action will permanently erase all recruitment-related database records: both **Pre-Reg Members** (applications) and **Recruitment Evaluations** (including task submissions and notes). This action cannot be undone.
              </p>
              {isGB && (
                <div className="pt-2">
                  {flushConfirm === "recruitment_all" ? (
                    <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 text-destructive font-bold text-[10px] uppercase tracking-widest">
                        <AlertTriangle className="w-3.5 h-3.5" /> Confirm Permanent Wipe
                      </div>
                      <p className="text-xs text-muted-foreground">Type <span className="font-mono text-foreground font-bold">recruitment_all</span> below to permanently erase all recruitment data.</p>
                      <Input 
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                        placeholder="Type recruitment_all..."
                        className="h-8 bg-transparent border-0 border-b border-destructive/30 rounded-none focus-visible:ring-0 focus-visible:border-destructive text-sm font-sans"
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1 h-8 text-[10px] font-bold uppercase"
                          onClick={() => handleFlush("recruitment_all")}
                          disabled={loading === "flush-recruitment_all"}
                        >
                          {loading === "flush-recruitment_all" ? "Wiping..." : "Confirm Wipe All"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 h-8 text-[10px] font-bold uppercase"
                          onClick={() => { setFlushConfirm(null); setConfirmInput(""); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="w-full gap-2"
                      onClick={() => setFlushConfirm("recruitment_all")}
                    >
                      <Trash2 className="w-4 h-4" /> Wipe Recruitment Data
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="max-w-2xl space-y-8">
          <Card className="border-border shadow-none bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Bulk Member Onboarding</CardTitle>
              <CardDescription>Upload a JSON array to create multiple accounts instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-3 bg-muted rounded-full w-fit mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Click to select JSON file</p>
                  <p className="text-xs text-muted-foreground italic">File must be a JSON array of member objects.</p>
                </div>
              </div>

              {jsonFile && (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-md flex items-center justify-between animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-primary">{jsonFile.length} members detected</p>
                      <p className="text-[10px] text-primary/70 uppercase font-mono tracking-tight">System validation passed</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest h-9"
                    onClick={triggerBulkOnboard}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>Start Onboarding <UserPlus className="ml-2 w-3.5 h-3.5" /></>
                    )}
                  </Button>
                </div>
              )}

              {onboardResults && (
                <div className="space-y-4 p-4 border border-border bg-muted/20 rounded-lg animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground">Onboarding Results</h4>
                    <button 
                      type="button" 
                      onClick={() => setOnboardResults(null)}
                      className="text-[10px] text-muted-foreground hover:text-foreground underline"
                    >
                      Clear Results
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-md">
                      <p className="text-2xl font-serif font-bold text-green-500">{onboardResults.success}</p>
                      <p className="text-[10px] uppercase font-bold text-green-500/70 tracking-wider">Successful</p>
                    </div>
                    <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-md">
                      <p className="text-2xl font-serif font-bold text-destructive">{onboardResults.failed}</p>
                      <p className="text-[10px] uppercase font-bold text-destructive/70 tracking-wider">Failed</p>
                    </div>
                  </div>

                  {onboardResults.errors && onboardResults.errors.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-destructive">Errors Log:</p>
                      <div className="max-h-[150px] overflow-y-auto border border-border/60 bg-background/50 rounded-sm p-3 font-mono text-[10px] text-muted-foreground space-y-1 divide-y divide-border/20">
                        {onboardResults.errors.map((err, idx) => (
                          <div key={idx} className="pt-1.5 first:pt-0 text-destructive/90 break-all">
                            {err}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Required JSON Structure</h4>
                <div className="bg-muted/50 p-4 rounded-md font-mono text-[10px] text-muted-foreground overflow-x-auto whitespace-pre">
{`[
  {
    "name": "Member Name",
    "email": "username@g.bracu.ac.bd",
    "studentId": "21101001",
    "phoneNumber": "017XXXXXXXX",
    "buccDepartment": "Creative",
    "bracuDepartment": "CSE",
    "designation": "General Member"
  }
]`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
