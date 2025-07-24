# HubSpot Workflow Configuration for Lead Routing

This document outlines the HubSpot workflows that need to be configured to support the automated lead routing system.

## Overview

The lead routing system automatically assigns leads to appropriate sales representatives based on priority, value, and property type. This document provides step-by-step instructions for configuring HubSpot workflows to support this automation.

## Required Custom Properties

Before setting up workflows, ensure these custom properties are created in HubSpot:

### Deal Properties
- `lead_priority` (Single-line text): Emergency, High, Medium, Low
- `lead_score` (Number): 0-100 lead score
- `is_emergency` (Single checkbox): Emergency flag
- `services_count` (Number): Number of services requested
- `assigned_sales_rep` (Single-line text): Assigned sales representative
- `notification_sent` (Single checkbox): Notification sent flag
- `property_square_footage` (Number): Property square footage
- `project_description` (Multi-line text): Project description
- `property_type` (Dropdown): Single Family, Multi Family, Commercial
- `location` (Single-line text): Property location

## Workflow 1: Emergency Lead Routing

**Purpose**: Immediately route emergency leads to the emergency response team.

### Setup Instructions:

1. **Create New Workflow**
   - Name: "Emergency Lead Routing"
   - Type: Deal-based
   - Enrollment: Automatic

2. **Enrollment Triggers**
   - Deal created AND `is_emergency` is equal to `true`
   - OR Deal updated AND `is_emergency` changed to `true`

3. **Workflow Actions**
   
   **Action 1: Set Deal Priority**
   - Action: Set property value
   - Property: `lead_priority`
   - Value: "Emergency"

   **Action 2: Assign to Emergency Team**
   - Action: Set property value
   - Property: `assigned_sales_rep`
   - Value: "emergency-dispatcher"

   **Action 3: Set Deal Owner**
   - Action: Set deal owner
   - Owner: Emergency Response Team (or specific user)

   **Action 4: Create Immediate Task**
   - Action: Create task
   - Title: "🚨 EMERGENCY LEAD - Immediate Response Required"
   - Description: "Emergency roofing request - Contact immediately"
   - Due date: Now
   - Assigned to: Emergency Response Team

   **Action 5: Send Internal Notification**
   - Action: Send internal email
   - To: Emergency team email list
   - Subject: "🚨 EMERGENCY LEAD - {{deal.dealname}}"
   - Template: Emergency notification template

   **Action 6: Schedule Follow-up**
   - Action: Create task
   - Title: "Emergency Lead Follow-up"
   - Description: "Follow up on emergency lead response"
   - Due date: 30 minutes from now
   - Assigned to: Emergency Response Team

## Workflow 2: High-Value Lead Routing

**Purpose**: Route high-value leads to senior sales representatives.

### Setup Instructions:

1. **Create New Workflow**
   - Name: "High-Value Lead Routing"
   - Type: Deal-based
   - Enrollment: Automatic

2. **Enrollment Triggers**
   - Deal created AND `amount` is greater than 15000
   - OR Deal created AND `property_type` is equal to "Commercial"
   - OR Deal created AND `services_count` is greater than 2
   - OR Deal updated AND `lead_score` is greater than 80

3. **Workflow Actions**

   **Action 1: Set Deal Priority**
   - Action: Set property value
   - Property: `lead_priority`
   - Value: "High"

   **Action 2: Assign to Senior Sales**
   - Action: Set property value
   - Property: `assigned_sales_rep`
   - Value: "senior-sales-rep"

   **Action 3: Set Deal Owner**
   - Action: Set deal owner
   - Owner: Senior Sales Representative

   **Action 4: Create High-Priority Task**
   - Action: Create task
   - Title: "💰 High-Value Lead - {{deal.dealname}}"
   - Description: "High-value estimate: ${{deal.amount}} - Contact within 2 hours"
   - Due date: 2 hours from now
   - Assigned to: Senior Sales Representative

   **Action 5: Add to High-Value Sequence**
   - Action: Enroll in sequence
   - Sequence: "High-Value Prospect Follow-up"

   **Action 6: Send Slack Notification**
   - Action: Send Slack notification (if Slack integration is configured)
   - Channel: #high-value-leads
   - Message: "New high-value lead: {{deal.dealname}} - ${{deal.amount}}"

## Workflow 3: Commercial Property Routing

**Purpose**: Route commercial properties to commercial specialists.

### Setup Instructions:

1. **Create New Workflow**
   - Name: "Commercial Property Routing"
   - Type: Deal-based
   - Enrollment: Automatic

2. **Enrollment Triggers**
   - Deal created AND `property_type` is equal to "Commercial"

3. **Workflow Actions**

   **Action 1: Set Deal Priority**
   - Action: Set property value
   - Property: `lead_priority`
   - Value: "High"

   **Action 2: Assign to Commercial Team**
   - Action: Set property value
   - Property: `assigned_sales_rep`
   - Value: "commercial-specialist"

   **Action 3: Set Deal Owner**
   - Action: Set deal owner
   - Owner: Commercial Specialist

   **Action 4: Create Commercial Task**
   - Action: Create task
   - Title: "🏢 Commercial Lead - {{deal.dealname}}"
   - Description: "Commercial property inquiry - {{deal.property_type}}"
   - Due date: 4 hours from now
   - Assigned to: Commercial Specialist

   **Action 5: Add Commercial Tags**
   - Action: Add tags to deal
   - Tags: "Commercial", "High-Priority"

## Workflow 4: Standard Lead Routing

**Purpose**: Route standard leads to general sales team with round-robin assignment.

### Setup Instructions:

1. **Create New Workflow**
   - Name: "Standard Lead Routing"
   - Type: Deal-based
   - Enrollment: Automatic

2. **Enrollment Triggers**
   - Deal created
   - AND `is_emergency` is not equal to `true`
   - AND `amount` is less than 15000
   - AND `property_type` is not equal to "Commercial"
   - AND `services_count` is less than 3

3. **Workflow Actions**

   **Action 1: Set Default Priority**
   - Action: Set property value
   - Property: `lead_priority`
   - Value: "Medium" (or "Low" based on lead score)

   **Action 2: Round-Robin Assignment**
   - Action: Rotate deal owner
   - Owners: Sales Rep 1, Sales Rep 2, Sales Rep 3

   **Action 3: Update Assigned Rep Field**
   - Action: Set property value
   - Property: `assigned_sales_rep`
   - Value: Based on deal owner assignment

   **Action 4: Create Standard Task**
   - Action: Create task
   - Title: "New Estimate Request - {{deal.dealname}}"
   - Description: "Standard estimate request - Contact within 24 hours"
   - Due date: 24 hours from now
   - Assigned to: Deal owner

   **Action 5: Add to Nurture Sequence**
   - Action: Enroll in sequence
   - Sequence: "Standard Lead Nurture"

## Workflow 5: Lead Scoring Update

**Purpose**: Automatically update lead scores and re-route if necessary.

### Setup Instructions:

1. **Create New Workflow**
   - Name: "Lead Score Update and Re-routing"
   - Type: Deal-based
   - Enrollment: Automatic

2. **Enrollment Triggers**
   - Deal updated AND any scoring-related property changes
   - Properties: `amount`, `services_count`, `property_type`, `property_square_footage`

3. **Workflow Actions**

   **Action 1: Calculate Lead Score**
   - Action: Set property value
   - Property: `lead_score`
   - Value: Use calculated field or webhook to update score

   **Action 2: Check for Priority Change**
   - Action: If/then branch
   - Condition: `lead_score` is greater than 80
   - Yes: Enroll in "High-Value Lead Routing" workflow
   - No: Continue to standard processing

## Notification Templates

### Emergency Notification Template
```
Subject: 🚨 EMERGENCY LEAD - Immediate Response Required

Emergency roofing request from {{contact.firstname}} {{contact.lastname}}

Details:
- Property: {{deal.location}}
- Estimate: ${{deal.amount}}
- Services: {{deal.services_requested}}
- Phone: {{contact.phone}}
- Description: {{deal.project_description}}

IMMEDIATE ACTION REQUIRED - Contact customer now!
```

### High-Value Notification Template
```
Subject: 💰 High-Value Lead - ${{deal.amount}}

High-value estimate request from {{contact.firstname}} {{contact.lastname}}

Details:
- Estimate: ${{deal.amount}}
- Property Type: {{deal.property_type}}
- Services: {{deal.services_requested}}
- Lead Score: {{deal.lead_score}}/100
- Location: {{deal.location}}

Contact within 2 hours for best conversion.
```

### Standard Notification Template
```
Subject: New Estimate Request - {{deal.dealname}}

New estimate request from {{contact.firstname}} {{contact.lastname}}

Details:
- Estimate: ${{deal.amount}}
- Services: {{deal.services_requested}}
- Property: {{deal.location}}
- Timeline: {{deal.project_timeline}}

Contact within 24 hours.
```

## Business Hours Considerations

For non-emergency leads, consider setting up business hours logic:

1. **Business Hours Property**
   - Create a calculated property that determines if it's business hours
   - Use this in delay actions for notifications

2. **After-Hours Handling**
   - Emergency leads: Process immediately
   - High-value leads: Delay notification until business hours
   - Standard leads: Queue for next business day

## Integration Points

### Slack Integration
- Configure Slack app in HubSpot
- Set up channels: #emergency-leads, #high-value-leads, #general-leads
- Use workflow actions to send notifications

### Email Integration
- Set up email templates for each priority level
- Configure automated sequences for follow-up
- Include CRM links for mobile access

### SMS Integration (Emergency Only)
- Configure SMS provider (Twilio, etc.)
- Emergency leads only to comply with regulations
- Include opt-out mechanisms

## Performance Monitoring

Set up reports to track:
- Response times by priority level
- Conversion rates by lead score
- Assignment distribution
- Workflow completion rates

## Testing Checklist

- [ ] Emergency leads trigger immediate notifications
- [ ] High-value leads are assigned to senior sales staff
- [ ] Commercial properties route to specialists
- [ ] Standard leads use round-robin assignment
- [ ] Business hours are respected for non-emergency leads
- [ ] Notification templates format correctly
- [ ] All custom properties are populated
- [ ] Workflows don't conflict with each other
- [ ] Mobile notifications work properly
- [ ] Follow-up tasks are created correctly