"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Label from "../ui/Label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AITaskCreator = ({ 
  onTaskParsed, 
  boardId, 
  availableLists = [], 
  boardTitle = "",
  onClose 
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);

  const handleParse = async () => {
    if (!input.trim()) {
      toast.error("Please enter a task description");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/parse-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          context: {
            boardTitle,
            availableLists: availableLists.map(l => ({ title: l.title })),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          setAiEnabled(false);
          toast.error("AI features are not enabled. Please set GEMINI_API_KEY.");
        } else if (response.status === 429 || data.isQuotaError) {
          // Quota exceeded error
          const retryTime = data.retryAfter ? ` Please try again in ${Math.ceil(data.retryAfter)} seconds.` : "";
          toast.error(`API Quota Exceeded${retryTime}`, {
            description: "You've reached your Gemini API free tier limit. Please wait or upgrade your plan at https://ai.google.dev/pricing",
          });
        } else {
          toast.error(data.message || "Failed to parse task");
        }
        return;
      }

      if (data.success && data.data) {
        setParsedData(data.data);
        toast.success("Task parsed successfully!");
      }
    } catch (error) {
      console.error("[AI Task Creator] Error:", error);
      toast.error("Failed to parse task");
    } finally {
      setLoading(false);
    }
  };

  const handleUseParsed = () => {
    if (parsedData && onTaskParsed) {
      onTaskParsed(parsedData);
      setInput("");
      setParsedData(null);
      onClose?.();
    }
  };

  const handleDiscard = () => {
    setParsedData(null);
    setInput("");
  };

  if (!aiEnabled) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          AI features require GEMINI_API_KEY to be set in environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Describe your task in natural language
        </Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 'Create login page with email and password fields, high priority, due tomorrow'"
          rows={3}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleParse();
            }
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Press Cmd/Ctrl + Enter to parse
        </p>
      </div>

      <Button
        onClick={handleParse}
        disabled={loading || !input.trim()}
        className="w-full"
        variant="outline"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Parsing with AI...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Parse Task
          </>
        )}
      </Button>

      {parsedData && (
        <div className="p-4 border border-primary/50 rounded-lg bg-primary/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Parsed Task Data
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Title:</span>{" "}
              <span className="text-foreground">{parsedData.title}</span>
            </div>
            {parsedData.description && (
              <div>
                <span className="font-medium text-muted-foreground">Description:</span>{" "}
                <span className="text-foreground">{parsedData.description}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-muted-foreground">Priority:</span>{" "}
              <span className={cn(
                "capitalize",
                parsedData.priority === "urgent" && "text-destructive",
                parsedData.priority === "high" && "text-orange-500",
                parsedData.priority === "medium" && "text-yellow-500",
                parsedData.priority === "low" && "text-muted-foreground"
              )}>
                {parsedData.priority}
              </span>
            </div>
            {parsedData.dueDate && (
              <div>
                <span className="font-medium text-muted-foreground">Due Date:</span>{" "}
                <span className="text-foreground">
                  {new Date(parsedData.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {parsedData.labels?.length > 0 && (
              <div>
                <span className="font-medium text-muted-foreground">Labels:</span>{" "}
                <span className="text-foreground">
                  {parsedData.labels.join(", ")}
                </span>
              </div>
            )}
            {parsedData.estimatedHours && (
              <div>
                <span className="font-medium text-muted-foreground">Estimated Hours:</span>{" "}
                <span className="text-foreground">{parsedData.estimatedHours}h</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleUseParsed}
              size="sm"
              className="flex-1"
            >
              Use
            </Button>
            <Button
              onClick={handleDiscard}
              variant="outline"
              size="sm"
            >
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITaskCreator;

