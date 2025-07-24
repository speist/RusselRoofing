import { NotificationRequest, NotificationTemplate, LeadPriority } from './types';
import { formatEstimateRange } from './scoring';
import { getNotificationConfig, isBusinessHours, getRoutingConfig } from './config';

/**
 * Notification Service for Lead Routing
 * Handles sending notifications through various channels based on lead priority
 */
export class NotificationService {
  private templates: NotificationTemplate;

  constructor() {
    this.templates = this.initializeTemplates();
  }

  /**
   * Initialize notification templates
   */
  private initializeTemplates(): NotificationTemplate {
    return {
      emergency: {
        subject: "🚨 EMERGENCY LEAD - Immediate Response Required",
        message: "Emergency roofing request from {customer_name} at {address}. Estimate: {estimate_range}. Contact: {phone}. Lead Score: {lead_score}/100"
      },
      high_value: {
        subject: "💰 High-Value Lead - {estimate_range}",
        message: "High-value estimate request from {customer_name}. Services: {services}. Score: {lead_score}/100. Location: {address}"
      },
      standard: {
        subject: "New Estimate Request - {customer_name}",
        message: "New estimate request for {services} at {address}. Estimate: {estimate_range}. Score: {lead_score}/100"
      }
    };
  }

  /**
   * Send notifications based on lead priority
   */
  async sendNotifications(request: NotificationRequest): Promise<string[]> {
    const sentNotifications: string[] = [];

    try {
      console.log(`[Notifications] Processing ${request.priority} priority lead: ${request.dealId}`);

      // Get notification configuration for this priority
      const notifConfig = getNotificationConfig(request.priority);
      const withinBusinessHours = isBusinessHours();

      // Determine if we should delay notifications
      const shouldDelay = !withinBusinessHours && request.priority !== 'emergency';
      const delay = shouldDelay ? this.calculateBusinessHoursDelay() : notifConfig.delay;

      if (delay > 0) {
        console.log(`[Notifications] Scheduling notifications for ${delay}ms delay`);
        setTimeout(() => this.executeNotifications(request, notifConfig), delay);
        sentNotifications.push('scheduled');
      } else {
        await this.executeNotifications(request, notifConfig);
        sentNotifications.push(...this.getChannelNames(notifConfig.channels));
      }

      console.log(`[Notifications] Processed ${sentNotifications.length} notifications for deal ${request.dealId}`);
      return sentNotifications;

    } catch (error) {
      console.error('[Notifications] Error sending notifications:', error);
      throw error;
    }
  }

  /**
   * Execute notifications through configured channels
   */
  private async executeNotifications(
    request: NotificationRequest, 
    config: { channels: ('sms' | 'slack' | 'email')[]; delay: number }
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const channel of config.channels) {
      switch (channel) {
        case 'sms':
          promises.push(this.sendSMSNotification(request));
          break;
        case 'slack':
          promises.push(this.sendSlackNotificationByPriority(request));
          break;
        case 'email':
          promises.push(this.sendEmailNotificationByPriority(request));
          break;
      }
    }

    await Promise.all(promises);
  }

  /**
   * Calculate delay until next business hours
   */
  private calculateBusinessHoursDelay(): number {
    const config = getRoutingConfig();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(config.businessHours.startHour, 0, 0, 0);
    
    return tomorrow.getTime() - now.getTime();
  }

  /**
   * Get channel names for logging
   */
  private getChannelNames(channels: ('sms' | 'slack' | 'email')[]): string[] {
    return channels.map(channel => `${channel}-notification`);
  }

  /**
   * Send emergency notifications (highest priority)
   */
  private async sendEmergencyNotifications(request: NotificationRequest): Promise<void> {
    const template = this.templates.emergency;
    const message = this.formatMessage(template.message, request);
    const subject = this.formatMessage(template.subject, request);

    // SMS notification (immediate)
    await this.sendSMS({
      to: this.getEmergencyPhoneNumbers(),
      message: this.formatSMSMessage(message),
      priority: 'immediate'
    });

    // Slack notification (immediate)
    await this.sendSlackNotification({
      channel: '#emergency-leads',
      message: this.formatSlackMessage(subject, message, request),
      priority: 'immediate',
      mentions: ['@emergency-team']
    });

    // Email notification (immediate)
    await this.sendEmailNotification({
      to: this.getEmergencyEmailList(),
      subject,
      message: this.formatEmailMessage(message, request),
      priority: 'immediate'
    });
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(request: NotificationRequest): Promise<void> {
    const template = this.templates.emergency;
    const message = this.formatMessage(template.message, request);
    
    await this.sendSMS({
      to: this.getEmergencyPhoneNumbers(),
      message: this.formatSMSMessage(message),
      priority: 'immediate'
    });
  }

  /**
   * Send Slack notification based on priority
   */
  private async sendSlackNotificationByPriority(request: NotificationRequest): Promise<void> {
    const template = this.getTemplateByPriority(request.priority);
    const message = this.formatMessage(template.message, request);
    const subject = this.formatMessage(template.subject, request);

    const channels = {
      emergency: '#emergency-leads',
      high: '#high-value-leads',
      medium: '#sales-leads',
      low: '#sales-leads'
    };

    const mentions = {
      emergency: ['@emergency-team', '@here'],
      high: ['@senior-sales'],
      medium: ['@sales-team'],
      low: ['@sales-team']
    };

    await this.sendSlackNotification({
      channel: channels[request.priority],
      message: this.formatSlackMessage(subject, message, request),
      priority: request.priority,
      mentions: mentions[request.priority]
    });
  }

  /**
   * Send email notification based on priority
   */
  private async sendEmailNotificationByPriority(request: NotificationRequest): Promise<void> {
    const template = this.getTemplateByPriority(request.priority);
    const message = this.formatMessage(template.message, request);
    const subject = this.formatMessage(template.subject, request);

    const recipients = this.getEmailRecipientsByPriority(request.priority);

    await this.sendEmailNotification({
      to: recipients,
      subject,
      message: this.formatEmailMessage(message, request),
      priority: request.priority
    });
  }

  /**
   * Get template by priority
   */
  private getTemplateByPriority(priority: LeadPriority) {
    switch (priority) {
      case 'emergency':
        return this.templates.emergency;
      case 'high':
        return this.templates.high_value;
      default:
        return this.templates.standard;
    }
  }

  /**
   * Send high-value notifications
   */
  private async sendHighValueNotifications(request: NotificationRequest): Promise<void> {
    const template = this.templates.high_value;
    const message = this.formatMessage(template.message, request);
    const subject = this.formatMessage(template.subject, request);

    // Slack notification
    await this.sendSlackNotification({
      channel: '#high-value-leads',
      message: this.formatSlackMessage(subject, message, request),
      priority: 'high',
      mentions: ['@senior-sales']
    });

    // Email notification
    await this.sendEmailNotification({
      to: this.getSeniorSalesEmailList(),
      subject,
      message: this.formatEmailMessage(message, request),
      priority: 'high'
    });
  }

  /**
   * Send standard notifications
   */
  private async sendStandardNotifications(request: NotificationRequest): Promise<void> {
    const template = this.templates.standard;
    const message = this.formatMessage(template.message, request);
    const subject = this.formatMessage(template.subject, request);

    // Email notification only for standard leads
    await this.sendEmailNotification({
      to: this.getStandardSalesEmailList(),
      subject,
      message: this.formatEmailMessage(message, request),
      priority: 'standard'
    });
  }

  /**
   * Format message template with dynamic data
   */
  private formatMessage(template: string, request: NotificationRequest): string {
    const estimateRange = formatEstimateRange(
      request.estimateRange.includes('-') 
        ? parseInt(request.estimateRange.split('-')[0].replace(/[^0-9]/g, ''))
        : parseInt(request.estimateRange.replace(/[^0-9]/g, '')),
      request.estimateRange.includes('-')
        ? parseInt(request.estimateRange.split('-')[1].replace(/[^0-9]/g, ''))
        : parseInt(request.estimateRange.replace(/[^0-9]/g, ''))
    );

    return template
      .replace('{customer_name}', request.customerName)
      .replace('{address}', request.address)
      .replace('{estimate_range}', estimateRange)
      .replace('{phone}', request.customerPhone || 'Not provided')
      .replace('{services}', request.services.join(', '))
      .replace('{lead_score}', request.leadScore.toString());
  }

  /**
   * Format SMS message (character limit optimized)
   */
  private formatSMSMessage(message: string): string {
    // SMS has character limits, so we truncate if necessary
    const maxLength = 160;
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength - 3) + '...';
  }

  /**
   * Format Slack message with rich formatting
   */
  private formatSlackMessage(subject: string, message: string, request: NotificationRequest): any {
    return {
      text: subject,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${subject}*\n${message}`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Deal ID:*\n${request.dealId}`
            },
            {
              type: "mrkdwn",
              text: `*Priority:*\n${request.priority.toUpperCase()}`
            },
            {
              type: "mrkdwn",
              text: `*Customer:*\n${request.customerName}`
            },
            {
              type: "mrkdwn",
              text: `*Score:*\n${request.leadScore}/100`
            }
          ]
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in HubSpot"
              },
              url: `${process.env.HUBSPOT_BASE_URL}/contacts/${request.dealId}`,
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Call Customer"
              },
              url: `tel:${request.customerPhone}`
            }
          ]
        }
      ]
    };
  }

  /**
   * Format HTML email message
   */
  private formatEmailMessage(message: string, request: NotificationRequest): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
              New Lead Notification
            </h2>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">${message}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
              <div>
                <strong>Deal ID:</strong> ${request.dealId}<br>
                <strong>Priority:</strong> <span style="color: ${this.getPriorityColor(request.priority)}; font-weight: bold;">${request.priority.toUpperCase()}</span><br>
                <strong>Lead Score:</strong> ${request.leadScore}/100
              </div>
              <div>
                <strong>Customer:</strong> ${request.customerName}<br>
                <strong>Email:</strong> ${request.customerEmail}<br>
                <strong>Phone:</strong> ${request.customerPhone || 'Not provided'}
              </div>
            </div>
            
            <div style="margin: 20px 0;">
              <strong>Services Requested:</strong><br>
              ${request.services.map(service => `• ${service}`).join('<br>')}
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.HUBSPOT_BASE_URL}/contacts/${request.dealId}" 
                 style="background: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View in HubSpot
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              Russell Roofing Lead Management System
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get priority color for styling
   */
  private getPriorityColor(priority: LeadPriority): string {
    const colors = {
      emergency: '#e74c3c',
      high: '#f39c12',
      medium: '#3498db',
      low: '#95a5a6'
    };
    return colors[priority] || colors.low;
  }

  /**
   * Mock SMS sending (replace with actual SMS service)
   */
  private async sendSMS(config: any): Promise<void> {
    console.log(`[SMS] Sending to ${config.to}:`, config.message);
    // TODO: Integrate with SMS service (Twilio, etc.)
  }

  /**
   * Mock Slack notification sending (replace with actual Slack API)
   */
  private async sendSlackNotification(config: any): Promise<void> {
    console.log(`[Slack] Sending to ${config.channel}:`, config.message);
    // TODO: Integrate with Slack API
  }

  /**
   * Mock email sending (replace with actual email service)
   */
  private async sendEmailNotification(config: any): Promise<void> {
    console.log(`[Email] Sending to ${config.to}:`, config.subject);
    // TODO: Integrate with email service (SendGrid, SES, etc.)
  }

  /**
   * Get email recipients by priority
   */
  private getEmailRecipientsByPriority(priority: LeadPriority): string[] {
    switch (priority) {
      case 'emergency':
        return this.getEmergencyEmailList();
      case 'high':
        return this.getSeniorSalesEmailList();
      default:
        return this.getStandardSalesEmailList();
    }
  }

  /**
   * Get emergency contact phone numbers
   */
  private getEmergencyPhoneNumbers(): string[] {
    // TODO: Load from environment variables or configuration
    const envPhones = process.env.EMERGENCY_PHONE_NUMBERS;
    if (envPhones) {
      return envPhones.split(',').map(phone => phone.trim());
    }
    return ['+1234567890']; // Placeholder
  }

  /**
   * Get emergency email list
   */
  private getEmergencyEmailList(): string[] {
    const envEmails = process.env.EMERGENCY_EMAIL_LIST;
    if (envEmails) {
      return envEmails.split(',').map(email => email.trim());
    }
    return [
      'emergency@russellroofing.com',
      'dispatch@russellroofing.com',
      'operations@russellroofing.com'
    ];
  }

  /**
   * Get senior sales email list
   */
  private getSeniorSalesEmailList(): string[] {
    const envEmails = process.env.SENIOR_SALES_EMAIL_LIST;
    if (envEmails) {
      return envEmails.split(',').map(email => email.trim());
    }
    return [
      'senior-sales@russellroofing.com',
      'sales-manager@russellroofing.com'
    ];
  }

  /**
   * Get standard sales email list
   */
  private getStandardSalesEmailList(): string[] {
    const envEmails = process.env.SALES_TEAM_EMAIL_LIST;
    if (envEmails) {
      return envEmails.split(',').map(email => email.trim());
    }
    return [
      'sales@russellroofing.com',
      'sales-team@russellroofing.com'
    ];
  }

  /**
   * Send targeted senior sales notification
   */
  async sendSeniorSalesNotification(request: NotificationRequest): Promise<string[]> {
    const sentNotifications: string[] = [];

    try {
      console.log(`[Notifications] Sending senior sales notification for deal: ${request.dealId}`);

      // Enhanced high-value template for senior sales
      const enhancedTemplate = {
        subject: "🎯 Senior Sales Assignment - High-Value Lead {estimate_range}",
        message: "High-priority lead assigned to senior sales team. Customer: {customer_name}. Estimate: {estimate_range}. Score: {lead_score}/100. Services: {services}. Location: {address}. Expected close probability: High. Recommended contact within 2 hours."
      };

      const message = this.formatMessage(enhancedTemplate.message, request);
      const subject = this.formatMessage(enhancedTemplate.subject, request);

      // Send enhanced email to senior sales team
      await this.sendEmailNotification({
        to: this.getSeniorSalesEmailList(),
        subject,
        message: this.formatSeniorSalesEmailMessage(message, request),
        priority: 'high'
      });

      // Send priority Slack notification
      await this.sendSlackNotification({
        channel: '#senior-sales',
        message: this.formatSeniorSalesSlackMessage(subject, message, request),
        priority: 'high',
        mentions: ['@senior-sales', '@sales-manager']
      });

      sentNotifications.push('senior-sales-email', 'senior-sales-slack');

      console.log(`[Notifications] Sent senior sales notifications for deal ${request.dealId}`);
      return sentNotifications;

    } catch (error) {
      console.error('[Notifications] Error sending senior sales notification:', error);
      throw error;
    }
  }

  /**
   * Format enhanced email message for senior sales
   */
  private formatSeniorSalesEmailMessage(message: string, request: NotificationRequest): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🎯 Senior Sales Assignment</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">High-Value Lead - Priority Contact</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border: 2px solid #667eea; border-top: none; border-radius: 0 0 10px 10px;">
              <div style="background: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #f39c12;">
                <p style="margin: 0; font-size: 16px; font-weight: bold;">${message}</p>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                <div style="background: #fff; padding: 15px; border-radius: 5px;">
                  <strong style="color: #667eea;">Deal Information</strong><br>
                  <strong>Deal ID:</strong> ${request.dealId}<br>
                  <strong>Lead Score:</strong> <span style="color: #f39c12; font-weight: bold;">${request.leadScore}/100</span><br>
                  <strong>Priority:</strong> <span style="color: #e74c3c; font-weight: bold;">${request.priority.toUpperCase()}</span>
                </div>
                <div style="background: #fff; padding: 15px; border-radius: 5px;">
                  <strong style="color: #667eea;">Customer Information</strong><br>
                  <strong>Name:</strong> ${request.customerName}<br>
                  <strong>Email:</strong> ${request.customerEmail}<br>
                  <strong>Phone:</strong> ${request.customerPhone || 'Not provided'}
                </div>
              </div>
              
              <div style="background: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong style="color: #667eea;">Services Requested:</strong><br>
                <ul style="margin: 10px 0;">
                  ${request.services.map(service => `<li style="margin: 5px 0;">${service}</li>`).join('')}
                </ul>
              </div>
              
              <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; margin: 20px 0;">
                <strong style="color: #2c3e50;">🎯 Senior Sales Action Items:</strong>
                <ul style="margin: 10px 0;">
                  <li>Contact customer within 2 hours for optimal conversion</li>
                  <li>Review lead score factors and customer history</li>
                  <li>Prepare customized proposal based on high-value indicators</li>
                  <li>Schedule on-site consultation if appropriate</li>
                </ul>
              </div>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${process.env.HUBSPOT_BASE_URL}/contacts/${request.dealId}" 
                   style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin-right: 15px; display: inline-block;">
                  View in HubSpot
                </a>
                <a href="tel:${request.customerPhone}" 
                   style="background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Call Customer
                </a>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              Russell Roofing Senior Sales Lead Management System
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format enhanced Slack message for senior sales
   */
  private formatSeniorSalesSlackMessage(subject: string, message: string, request: NotificationRequest): any {
    return {
      text: subject,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎯 Senior Sales Assignment - High-Value Lead"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${subject}*\n${message}`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Deal ID:*\n${request.dealId}`
            },
            {
              type: "mrkdwn",
              text: `*Lead Score:*\n⭐ ${request.leadScore}/100`
            },
            {
              type: "mrkdwn",
              text: `*Customer:*\n${request.customerName}`
            },
            {
              type: "mrkdwn",
              text: `*Estimate:*\n${request.estimateRange}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Services:* ${request.services.join(', ')}\n*Location:* ${request.address}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🎯 *Action Required:* Contact within 2 hours for optimal conversion. High-value lead with strong close probability."
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in HubSpot"
              },
              url: `${process.env.HUBSPOT_BASE_URL}/contacts/${request.dealId}`,
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Call Customer"
              },
              url: `tel:${request.customerPhone}`
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Mark as Contacted"
              },
              action_id: "mark_contacted",
              value: request.dealId
            }
          ]
        }
      ]
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();