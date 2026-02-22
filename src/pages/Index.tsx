import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import RouteForm from "@/components/RouteForm";
import ResultsCard from "@/components/ResultsCard";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface OptimizationResult {
  rl_energy: number;
  google_energy: number;
  rl_time: number;
  google_time: number;
  route_rl: [number, number][];
  route_google: [number, number][];
  episodes: number;
  converged: boolean;
}

const Index = () => {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptimize = async (start: string, destination: string, stepLength: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize", {
        body: { start, destination, step_length: stepLength },
      });

      if (error) throw error;
      setResult(data);
      toast.success("Route optimized successfully!");
    } catch (err: any) {
      toast.error(err.message || "Optimization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Electric Vehicle Energy Optimization
            </h1>
            <p className="text-sm text-muted-foreground">
              using Double-DQN Reinforcement Learning
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/history")}>
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Form */}
        <RouteForm onOptimize={handleOptimize} loading={loading} />

        {/* Results Split */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MapView routeRl={result.route_rl} routeGoogle={result.route_google} />
            <ResultsCard result={result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
