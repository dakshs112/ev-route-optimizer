import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History as HistoryIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

const History = () => {
  const [routes, setRoutes] = useState<Tables<"routes">[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) setRoutes(data);
      setLoading(false);
    };
    fetchRoutes();
  }, []);

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HistoryIcon className="h-6 w-6 text-primary" />
            Optimization History
          </h1>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Last 10 Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Loading...</p>
            ) : routes.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No optimizations yet</p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Step</TableHead>
                      <TableHead>RL Energy</TableHead>
                      <TableHead>Google Energy</TableHead>
                      <TableHead>Saved</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => {
                      const saved = route.google_energy && route.rl_energy
                        ? ((route.google_energy - route.rl_energy) / route.google_energy * 100).toFixed(1)
                        : "N/A";
                      return (
                        <TableRow
                          key={route.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate("/", { state: { route } })}
                        >
                          <TableCell className="font-medium text-sm max-w-[150px] truncate">{route.start_location}</TableCell>
                          <TableCell className="text-sm max-w-[150px] truncate">{route.destination}</TableCell>
                          <TableCell><Badge variant="secondary">{route.step_length}m</Badge></TableCell>
                          <TableCell className="text-primary font-medium">{route.rl_energy?.toFixed(1) ?? "—"}</TableCell>
                          <TableCell className="text-accent font-medium">{route.google_energy?.toFixed(1) ?? "—"}</TableCell>
                          <TableCell>
                            {saved !== "N/A" && (
                              <Badge className="bg-primary text-primary-foreground">{saved}%</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(route.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
