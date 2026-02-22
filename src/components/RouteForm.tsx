import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Zap } from "lucide-react";

interface RouteFormProps {
  onOptimize: (start: string, destination: string, stepLength: number) => void;
  loading: boolean;
}

const RouteForm = ({ onOptimize, loading }: RouteFormProps) => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [stepLength, setStepLength] = useState("1000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start.trim() || !destination.trim()) return;
    onOptimize(start, destination, parseInt(stepLength));
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Route Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start Location</Label>
            <Input
              id="start"
              placeholder="e.g. 12.9716, 77.5946 or Bangalore"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g. 13.0827, 80.2707 or Chennai"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Step Length</Label>
            <Select value={stepLength} onValueChange={setStepLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500">500m</SelectItem>
                <SelectItem value="750">750m</SelectItem>
                <SelectItem value="1000">1000m</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Optimize Route
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
