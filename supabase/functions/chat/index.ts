import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = 'your_supabase_url'; // Replace with your Supabase URL
const supabaseKey = 'your_supabase_key'; // Replace with your Supabase Key
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get today's date in IST
const getTodayIST = (): string => {
    const now = new Date();
    return now.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
};

// Middleware for JWT verification
const verifyJWT = (token: string) => {
    // Add your JWT secret here
    return jwt.verify(token, 'your_jwt_secret');
};

// Function for tracking usage
const trackUsage = async (userId: string, apiEndpoint: string) => {
    const { data, error } = await supabase
        .from('usage_logs')
        .insert([{ userId, apiEndpoint, timestamp: getTodayIST() }]);
    if (error) {
        console.error('Error tracking usage:', error);
    }
};

// Function for checking daily limits
const checkDailyLimits = async (userId: string): Promise<boolean> => {
    const { data: limits, error: limitError } = await supabase
        .from('daily_limits')
        .select('*')
        .eq('userId', userId)
        .single();

    const { data: logs, error: logError } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('userId', userId)
        .gte('timestamp', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()); // current day's logs

    if (limitError || logError) {
        console.error('Error fetching limits or logs:', limitError || logError);
        return false;
    }

    return logs.length < limits.dailyLimit; // Check if usage is within limits
};

// Function to handle API call logic
const handleApiCall = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = verifyJWT(token); // Assuming the returned object has userId

    if (!await checkDailyLimits(userId)) {
        return res.status(429).json({ error: "Daily limit exceeded." });
    }

    // Place logic to call the Anthropic API here
    await trackUsage(userId, 'Anthropic API Call');

    // Respond back with the API response
    res.status(200).json({ message: "API call successful." });
};

export { handleApiCall, getTodayIST };