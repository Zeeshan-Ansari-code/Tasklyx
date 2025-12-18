"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import AITaskCreator from "./AITaskCreator";

const AITaskModal = ({ 
  isOpen, 
  onClose, 
  onTaskCreated,
  boardId,
  boardTitle = "",
  availableLists = [],
  defaultListId = null
}) => {
  const [parsedData, setParsedData] = useState(null);

  const handleTaskParsed = (data) => {
    setParsedData(data);
  };

  const handleCreateTask = async () => {
    if (!parsedData || !defaultListId) {
      return;
    }

    try {
      const res = await fetch(`/api/lists/${defaultListId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: parsedData.title,
          description: parsedData.description || "",
          boardId,
          priority: parsedData.priority || "medium",
          dueDate: parsedData.dueDate || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        let createdTask = data.task;
        
        // Add labels if any
        if (parsedData.labels?.length > 0 && createdTask?._id) {
          // Update task with labels
          const labelRes = await fetch(`/api/tasks/${createdTask._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              labels: parsedData.labels.map(name => ({ name, color: "#3b82f6" })),
            }),
          });
          
          if (labelRes.ok) {
            const labelData = await labelRes.json();
            createdTask = labelData;
          }
        }

        // Call onTaskCreated with the full task data
        onTaskCreated?.(createdTask);
        onClose();
        setParsedData(null);
      } else {
        throw new Error(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("[AI Task Modal] Error:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI Task Creator</span>
        </div>
      }
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Describe your task in natural language, and AI will extract the details automatically.
        </p>

        <AITaskCreator
          onTaskParsed={handleTaskParsed}
          boardId={boardId}
          boardTitle={boardTitle}
          availableLists={availableLists}
          onClose={onClose}
        />

        {parsedData && (
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleCreateTask}
              className="w-full"
              disabled={!defaultListId}
            >
              Create Task
            </Button>
            {!defaultListId && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Please select a list first
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AITaskModal;

