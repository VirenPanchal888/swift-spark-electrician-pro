
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Parse request body once at the beginning
  let requestBody
  try {
    requestBody = await req.json()
  } catch (error) {
    console.error('Failed to parse request body:', error)
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }

  const { phone_number, message, employee_name } = requestBody

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Twilio credentials from environment
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    console.log('Twilio Account SID exists:', !!twilioAccountSid)
    console.log('Twilio Auth Token exists:', !!twilioAuthToken)
    console.log('Twilio Phone Number exists:', !!twilioPhoneNumber)

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured properly')
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
    
    const formData = new URLSearchParams()
    formData.append('From', twilioPhoneNumber)
    formData.append('To', phone_number)
    formData.append('Body', message)

    console.log('Sending SMS to:', phone_number)
    console.log('From number:', twilioPhoneNumber)
    console.log('Message:', message)

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    const twilioResult = await twilioResponse.json()
    
    if (!twilioResponse.ok) {
      console.error('Twilio API error:', twilioResult)
      throw new Error(`Twilio API error: ${twilioResult.message || 'Unknown error'}`)
    }

    console.log(`SMS sent successfully to ${phone_number}: ${message}`)
    console.log('Twilio response:', twilioResult)
    
    // Store SMS record in database with success status
    const { data, error } = await supabase
      .from('sms_notifications')
      .insert({
        phone_number,
        message,
        employee_name,
        status: 'sent',
        sent_at: new Date().toISOString()
      })

    if (error) {
      console.error('Database error:', error)
      // Don't throw here since SMS was sent successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        twilio_sid: twilioResult.sid,
        message: 'SMS sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('SMS sending failed:', error)
    
    // Try to log the failed attempt to database
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      await supabase
        .from('sms_notifications')
        .insert({
          phone_number: requestBody.phone_number,
          message: requestBody.message,
          employee_name: requestBody.employee_name,
          status: 'failed',
          sent_at: new Date().toISOString()
        })
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
