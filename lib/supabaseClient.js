
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL || "https://lipqhibiyftiahrbfzdg.supabase.co",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcHFoaWJpeWZ0aWFocmJmemRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMDMxMTAsImV4cCI6MjA2MDc3OTExMH0.d_4XRzQKPzjhSSrcqmj0WOb_AFWJ_dxEFEDRwcx8oeo",
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });