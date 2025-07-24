import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';
import { DealInput } from '@/lib/hubspot/types';
import { leadRoutingEngine } from '@/lib/lead-routing/routing-engine';
import { notificationService } from '@/lib/lead-routing/notifications';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as DealInput;

    // Validate required fields
    if (!data.dealname || !data.amount || !data.services_requested) {
      return NextResponse.json(
        { error: 'Missing required fields: dealname, amount, services_requested' },
        { status: 400 }
      );
    }

    // Parse services if it's a string
    const services = Array.isArray(data.services_requested) 
      ? data.services_requested 
      : data.services_requested.split(',').map(s => s.trim());

    // Process lead through routing engine
    const leadData = {
      dealId: 'temp-' + Date.now(), // Temporary ID, will be replaced with actual deal ID
      estimateMin: data.estimate_min,
      estimateMax: data.estimate_max,
      propertyType: data.property_type,
      services: services,
      timeline: data.project_timeline,
      location: data.location,
      projectDescription: data.project_description,
      isEmergencyChecked: data.is_emergency
    };

    console.log('[Deal API] Processing lead through routing engine:', leadData);
    const routingResult = await leadRoutingEngine.processLead(leadData);

    // Enhance deal data with routing results
    const enhancedDealData: DealInput = {
      ...data,
      lead_priority: routingResult.priority,
      lead_score: routingResult.score,
      services_count: services.length,
      assigned_sales_rep: routingResult.assignedRep,
      notification_sent: false
    };

    // Create deal using HubSpot service
    const result = await hubspotService.createDeal(enhancedDealData);

    if (result.success && result.data) {
      const dealId = result.data.id;
      
      // Update routing result with actual deal ID
      routingResult.dealId = dealId;

      // Send notifications based on priority
      try {
        const notificationRequest = {
          priority: routingResult.priority,
          dealId: dealId,
          customerName: data.dealname.split(' - ')[0] || 'Customer', // Extract name from deal name
          customerEmail: 'customer@example.com', // This should come from contact data
          customerPhone: undefined, // This should come from contact data
          address: data.location || 'Not specified',
          estimateRange: `$${data.estimate_min} - $${data.estimate_max}`,
          services: services,
          leadScore: routingResult.score,
          assignedRep: routingResult.assignedRep
        };

        const sentNotifications = await notificationService.sendNotifications(notificationRequest);
        routingResult.notificationsSent = sentNotifications;

        // Update deal to mark notifications as sent
        await hubspotService.updateDeal(dealId, { notification_sent: true } as Partial<DealInput>);

      } catch (notificationError) {
        console.error('[Deal API] Failed to send notifications:', notificationError);
        // Don't fail the whole request if notifications fail
      }

      return NextResponse.json({
        dealId: dealId,
        dealname: data.dealname,
        message: 'Deal created and processed successfully',
        data: result.data,
        routing: {
          priority: routingResult.priority,
          score: routingResult.score,
          isEmergency: routingResult.isEmergency,
          assignedRep: routingResult.assignedRep,
          workflowsTriggered: routingResult.workflowsTriggered,
          notificationsSent: routingResult.notificationsSent
        }
      });
    } else {
      console.error('[HubSpot API] Deal creation failed:', result.error);
      return NextResponse.json(
        { 
          error: result.error?.message || 'Failed to create deal',
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