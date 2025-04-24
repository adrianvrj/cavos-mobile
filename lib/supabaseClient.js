import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lipqhibiyftiahrbfzdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcHFoaWJpeWZ0aWFocmJmemRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMDMxMTAsImV4cCI6MjA2MDc3OTExMH0.d_4XRzQKPzjhSSrcqmj0WOb_AFWJ_dxEFEDRwcx8oeo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
