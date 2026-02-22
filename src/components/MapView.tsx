/// <reference types="@types/google.maps" />
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface MapViewProps {
  routeRl: [number, number][] | null;
  routeGoogle: [number, number][] | null;
}

const MapView = ({ routeRl, routeGoogle }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") return;
    if (mapInstanceRef.current || !mapRef.current) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => {
      if (mapRef.current && (window as any).google) {
        const g = (window as any).google;
        mapInstanceRef.current = new g.maps.Map(mapRef.current, {
          center: { lat: 12.9716, lng: 77.5946 },
          zoom: 7,
          styles: darkMapStyle,
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g) return;

    polylinesRef.current.forEach((p: any) => p.setMap(null));
    markersRef.current.forEach((m: any) => m.setMap(null));
    polylinesRef.current = [];
    markersRef.current = [];

    if (routeGoogle && routeGoogle.length > 0) {
      const path = routeGoogle.map(([lat, lng]) => ({ lat, lng }));
      const polyline = new g.maps.Polyline({
        path, strokeColor: "#0EA5E9", strokeWeight: 4, strokeOpacity: 0.8, map,
      });
      polylinesRef.current.push(polyline);
    }

    if (routeRl && routeRl.length > 0) {
      const path = routeRl.map(([lat, lng]) => ({ lat, lng }));
      const polyline = new g.maps.Polyline({
        path, strokeColor: "#22C55E", strokeWeight: 4, strokeOpacity: 0.9, map,
      });
      polylinesRef.current.push(polyline);

      const startMarker = new g.maps.Marker({
        position: { lat: routeRl[0][0], lng: routeRl[0][1] }, map,
        icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }, title: "Start",
      });
      const endMarker = new g.maps.Marker({
        position: { lat: routeRl[routeRl.length - 1][0], lng: routeRl[routeRl.length - 1][1] }, map,
        icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }, title: "Destination",
      });
      markersRef.current.push(startMarker, endMarker);

      const bounds = new g.maps.LatLngBounds();
      routeRl.forEach(([lat, lng]) => bounds.extend({ lat, lng }));
      if (routeGoogle) routeGoogle.forEach(([lat, lng]) => bounds.extend({ lat, lng }));
      map.fitBounds(bounds);
    }
  }, [routeRl, routeGoogle]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasApiKey = apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY";

  if (!hasApiKey) {
    return (
      <Card className="h-full min-h-[400px] border-border/50 shadow-lg flex items-center justify-center bg-card">
        <div className="text-center space-y-3 p-6">
          <div className="w-full h-48 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Google Maps Preview</p>
          <p className="text-xs text-muted-foreground/70">Set VITE_GOOGLE_MAPS_API_KEY to enable live map</p>
          {(routeRl || routeGoogle) && (
            <div className="mt-4 text-left space-y-2">
              {routeRl && (
                <div>
                  <p className="text-xs font-medium text-primary">🟢 RL Route: {routeRl.length} waypoints</p>
                  <p className="text-xs text-muted-foreground">
                    {routeRl[0][0].toFixed(4)}, {routeRl[0][1].toFixed(4)} → {routeRl[routeRl.length-1][0].toFixed(4)}, {routeRl[routeRl.length-1][1].toFixed(4)}
                  </p>
                </div>
              )}
              {routeGoogle && (
                <div>
                  <p className="text-xs font-medium text-accent">🔵 Google Route: {routeGoogle.length} waypoints</p>
                  <p className="text-xs text-muted-foreground">
                    {routeGoogle[0][0].toFixed(4)}, {routeGoogle[0][1].toFixed(4)} → {routeGoogle[routeGoogle.length-1][0].toFixed(4)}, {routeGoogle[routeGoogle.length-1][1].toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-[400px] border-border/50 shadow-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
    </Card>
  );
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
];

export default MapView;
