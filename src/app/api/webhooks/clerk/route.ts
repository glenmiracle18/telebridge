import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
 

const evt = await verifyWebhook(req);
  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, phone_numbers, unsafe_metadata } = evt.data;
    
    // Extract email
    const emailAddress = email_addresses && email_addresses.length > 0 
      ? email_addresses[0].email_address 
      : null;
    
    // Extract phone
    const phoneNumber = phone_numbers && phone_numbers.length > 0 
      ? phone_numbers[0].phone_number 
      : null;
    
    // Extract role from metadata
    const role = unsafe_metadata?.role as string || 'PATIENT';

    if (!emailAddress) {
      console.error('Error: User created without email');
      return NextResponse.json({ error: 'User created without email' }, { status: 400 });
    }

    try {
      // Create user in your database
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: emailAddress,
          phoneNumber: phoneNumber || undefined,
          role: role.toUpperCase() as any, // Convert to enum value
        },
      });
      
      console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
      console.log('Webhook payload:', evt.data)
      console.log(`User created: ${user.id}`);
      return NextResponse.json({ success: true, userId: user.id });
    } catch (error) {
      console.error('Error creating user in database:', error);
      return NextResponse.json({ error: 'Failed to create user in database' }, { status: 500 });
    }
  }

  // Return a 200 response for other event types
  return NextResponse.json({ success: true });
} 