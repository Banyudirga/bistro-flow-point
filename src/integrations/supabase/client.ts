// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://raadlocosdcvnzejnxsf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYWRsb2Nvc2Rjdm56ZWpueHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTkzMjcsImV4cCI6MjA2Mjg5NTMyN30._6S8CZr37I-KGYN4axj9yFPRTGX6TVna5Sue2LcMAjs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);