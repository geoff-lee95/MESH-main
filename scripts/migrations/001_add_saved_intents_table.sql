-- Add saved_intents table for the Save for Later feature
CREATE TABLE IF NOT EXISTS public.saved_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intent_id UUID NOT NULL REFERENCES public.intents(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, intent_id)
);

-- Add RLS policies for saved_intents
ALTER TABLE public.saved_intents ENABLE ROW LEVEL SECURITY;

-- Policy for selecting user's own saved intents
CREATE POLICY "Users can view their own saved intents" 
  ON public.saved_intents 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting saved intents
CREATE POLICY "Users can save intents" 
  ON public.saved_intents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting user's own saved intents
CREATE POLICY "Users can delete their own saved intents" 
  ON public.saved_intents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX saved_intents_user_id_idx ON public.saved_intents(user_id);
CREATE INDEX saved_intents_intent_id_idx ON public.saved_intents(intent_id); 