"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AIModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/ai/models");
      const data = await response.json();

      if (response.ok && data.success) {
        setModels(data.models || []);
      } else {
        setError(data.message || "Failed to fetch models");
        if (data.message?.includes("GEMINI_API_KEY")) {
          toast.error("Please set GEMINI_API_KEY in your .env.local file");
        }
      }
    } catch (error) {
      console.error("[AI Models] Error:", error);
      setError("Failed to fetch models. Please check your API key.");
      toast.error("Failed to fetch models");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "N/A";
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Available Gemini Models
          </h1>
          <p className="text-muted-foreground mt-1">
            View all available models and their free tier eligibility
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchModels}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure GEMINI_API_KEY is set in your .env.local file and restart your server.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading available models...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Models List */}
      {!loading && !error && models.length > 0 && (
        <div className="grid gap-4">
          {models.map((model, index) => (
            <Card
              key={index}
              className={`border-border/50 shadow-sm transition-all hover:shadow-md ${
                model.isFreeTier ? "border-primary/20 bg-primary/5" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-semibold">
                        {model.displayName}
                      </CardTitle>
                      {model.isFreeTier && (
                        <Badge variant="default" className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Free Tier
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {model.description || `Model name: ${model.name}`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Model ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {model.name}
                    </code>
                  </div>
                  {model.inputTokenLimit && (
                    <div>
                      <p className="text-muted-foreground mb-1">Input Tokens</p>
                      <p className="font-medium">{formatNumber(model.inputTokenLimit)}</p>
                    </div>
                  )}
                  {model.outputTokenLimit && (
                    <div>
                      <p className="text-muted-foreground mb-1">Output Tokens</p>
                      <p className="font-medium">{formatNumber(model.outputTokenLimit)}</p>
                    </div>
                  )}
                </div>
                {model.supportedMethods.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Supported Methods:</p>
                    <div className="flex flex-wrap gap-2">
                      {model.supportedMethods.map((method, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && models.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No models found</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">How to Use a Model</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            To use a specific model, add it to your <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.env.local</code> file:
          </p>
          <code className="block bg-muted/50 p-3 rounded text-xs font-mono">
            GEMINI_MODEL=model-name-here
          </code>
          <p className="text-xs text-muted-foreground mt-3">
            Then restart your development server for the changes to take effect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

