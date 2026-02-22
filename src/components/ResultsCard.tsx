import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Battery, Clock, TrendingDown, Activity } from "lucide-react";

interface OptimizationResult {
  rl_energy: number;
  google_energy: number;
  rl_time: number;
  google_time: number;
  episodes: number;
  converged: boolean;
}

interface ResultsCardProps {
  result: OptimizationResult | null;
}

const ResultsCard = ({ result }: ResultsCardProps) => {
  if (!result) {
    return (
      <Card className="h-full border-border/50 shadow-lg">
        <CardContent className="flex items-center justify-center h-full min-h-[300px]">
          <p className="text-muted-foreground text-sm">Run optimization to see results</p>
        </CardContent>
      </Card>
    );
  }

  const energySaved = ((result.google_energy - result.rl_energy) / result.google_energy * 100).toFixed(1);
  const timeDiff = ((result.google_time - result.rl_time) / result.google_time * 100).toFixed(1);

  return (
    <Card className="h-full border-border/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Optimization Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Energy Comparison */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Battery className="h-4 w-4 text-primary" />
            Energy Consumption (J)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">RL Optimized</p>
              <p className="text-xl font-bold text-primary">{result.rl_energy.toFixed(1)}</p>
            </div>
            <div className="rounded-lg bg-accent/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">Google Default</p>
              <p className="text-xl font-bold text-accent">{result.google_energy.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Energy Saved:</span>
            <Badge variant="default" className="bg-primary text-primary-foreground">
              {energySaved}%
            </Badge>
          </div>
        </div>

        {/* Time Comparison */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            Duration (seconds)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">RL Optimized</p>
              <p className="text-xl font-bold text-primary">{result.rl_time}s</p>
            </div>
            <div className="rounded-lg bg-accent/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">Google Default</p>
              <p className="text-xl font-bold text-accent">{result.google_time}s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Time Diff:</span>
            <Badge variant={parseFloat(timeDiff) > 0 ? "default" : "secondary"} className={parseFloat(timeDiff) > 0 ? "bg-primary text-primary-foreground" : ""}>
              {timeDiff}%
            </Badge>
          </div>
        </div>

        {/* Training Info */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Episodes</span>
            <span className="font-medium">{result.episodes}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Convergence</span>
            <Badge variant={result.converged ? "default" : "secondary"} className={result.converged ? "bg-primary text-primary-foreground" : ""}>
              {result.converged ? "Converged" : "Not Converged"}
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Training Progress</span>
            <Progress value={result.converged ? 100 : 65} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
