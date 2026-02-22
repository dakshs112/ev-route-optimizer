
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  step_length INTEGER NOT NULL DEFAULT 1000,
  rl_energy DOUBLE PRECISION,
  google_energy DOUBLE PRECISION,
  rl_time DOUBLE PRECISION,
  google_time DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No auth, so allow public access
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.routes FOR INSERT WITH CHECK (true);
