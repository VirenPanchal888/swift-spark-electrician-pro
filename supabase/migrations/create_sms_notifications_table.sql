
-- Create SMS notifications table
CREATE TABLE IF NOT EXISTS sms_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    employee_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on phone_number for faster queries
CREATE INDEX IF NOT EXISTS idx_sms_notifications_phone ON sms_notifications(phone_number);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_sms_notifications_status ON sms_notifications(status);

-- Enable Row Level Security
ALTER TABLE sms_notifications ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on sms_notifications" ON sms_notifications
    FOR ALL USING (true);
