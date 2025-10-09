import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';
import { TicketInput } from '@/lib/hubspot/types';
import { leadRoutingEngine } from '@/lib/lead-routing/routing-engine';
import { notificationService } from '@/lib/lead-routing/notifications';
import { envMiddleware } from '@/lib/middleware/env-check';

export async function POST(request: NextRequest) {
  // Validate environment variables required for HubSpot API
  const envCheck = envMiddleware.hubspot(request);
  if (envCheck) {
    return envCheck; // Return error response if validation fails
  }

  try {
    const data = await request.json() as TicketInput;

    // Validate required fields
    if (!data.subject || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, content' },
        { status: 400 }
      );
    }

    // Parse services if provided and it's a string
    const services = data.services_requested
      ? (Array.isArray(data.services_requested)
          ? data.services_requested
          : data.services_requested.split(',').map(s => s.trim()))
      : [];

    // Process lead through routing engine if we have estimate data
    let routingResult;
    if (data.estimate_min !== undefined && data.estimate_max !== undefined && services.length > 0) {
      const leadData = {
        ticketId: 'temp-' + Date.now(), // Temporary ID, will be replaced with actual ticket ID
        estimateMin: data.estimate_min,
        estimateMax: data.estimate_max,
        propertyType: data.property_type,
        services: services,
        timeline: data.project_timeline,
        location: data.property_address,
        isEmergencyChecked: data.is_emergency || false
      };

      console.log('[Ticket API] Processing lead through routing engine:', leadData);
      routingResult = await leadRoutingEngine.processLead(leadData);

      // Set ticket priority based on routing priority
      const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
        'emergency': 'URGENT',
        'high': 'HIGH',
        'medium': 'MEDIUM',
        'low': 'LOW'
      };
      data.hs_ticket_priority = priorityMap[routingResult.priority] || 'MEDIUM';
    }

    // Create ticket using HubSpot service
    const result = await hubspotService.createTicket(data);

    if (result.success && result.data) {
      const ticketId = result.data.id;

      // Send notifications if we processed routing
      if (routingResult) {
        routingResult.dealId = ticketId; // Reuse dealId field for ticketId

        try {
          const notificationRequest = {
            priority: routingResult.priority,
            dealId: ticketId, // Using dealId field for ticketId
            customerName: data.subject.split(' - ')[0] || 'Customer', // Extract name from subject
            customerEmail: 'customer@example.com', // This should come from contact data
            customerPhone: undefined, // This should come from contact data
            address: data.property_address || 'Not specified',
            estimateRange: data.estimate_min && data.estimate_max
              ? `$${data.estimate_min} - $${data.estimate_max}`
              : 'Not specified',
            services: services,
            leadScore: routingResult.score,
            assignedRep: routingResult.assignedRep
          };

          const sentNotifications = await notificationService.sendNotifications(notificationRequest);
          routingResult.notificationsSent = sentNotifications;

        } catch (notificationError) {
          console.error('[Ticket API] Failed to send notifications:', notificationError);
          // Don't fail the whole request if notifications fail
        }
      }

      return NextResponse.json({
        ticketId: ticketId,
        subject: data.subject,
        message: 'Ticket created and processed successfully',
        data: result.data,
        routing: routingResult ? {
          priority: routingResult.priority,
          score: routingResult.score,
          isEmergency: routingResult.isEmergency,
          assignedRep: routingResult.assignedRep,
          workflowsTriggered: routingResult.workflowsTriggered,
          notificationsSent: routingResult.notificationsSent
        } : undefined
      });
    } else {
      console.error('[HubSpot API] Ticket creation failed:', result.error);
      return NextResponse.json(
        {
          error: result.error?.message || 'Failed to create ticket',
          details: result.error
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[HubSpot API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
