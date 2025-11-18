import ContactsService from './contacts';
import DealsService from './deals';
import TicketsService from './tickets';
import BlogService from './blog';
import CareersService from './careers';
import CommunityService from './community';
import TeamService from './team';
import NotesService, { NoteInput, Note } from './notes';
import { ContactInput, DealInput, TicketInput, Contact, Deal, Ticket, ContactProfile, BlogPost, BlogListResponse, BlogPostParams, HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';
import { Career, CareersListResponse, CareersParams } from './careers';
import { CommunityActivity, CommunityListResponse, CommunityParams } from './community';
import { TeamMember, TeamListResponse, TeamParams } from './team';
import { extractKnownFields, validateContactInput, validateDealInput, validateTicketInput } from './utils';
import { getServiceConfig, isServiceConfigured } from '../config';

// Re-export types for convenience
export type { NoteInput, Note } from './notes';
export type { TeamMember, TeamListResponse, TeamParams } from './team';

interface HubSpotService {
  // Contact operations
  createContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>>;
  updateContact(contactId: string, updates: Partial<ContactInput>): Promise<HubSpotApiResponse<Contact>>;
  findContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>>;
  findContactByEmailAndName(email: string, firstname: string, lastname: string): Promise<HubSpotApiResponse<Contact | null>>;

  // Deal operations
  createDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>>;
  associateContactToDeal(contactId: string, dealId: string): Promise<HubSpotApiResponse<void>>;

  // Note operations
  createNote(noteData: NoteInput): Promise<HubSpotApiResponse<Note>>;
  associateNoteToDeal(noteId: string, dealId: string): Promise<HubSpotApiResponse<void>>;
  associateNoteToContact(noteId: string, contactId: string): Promise<HubSpotApiResponse<void>>;

  // Ticket operations
  createTicket(ticketData: TicketInput): Promise<HubSpotApiResponse<Ticket>>;
  associateContactToTicket(contactId: string, ticketId: string): Promise<HubSpotApiResponse<void>>;

  // Blog operations
  getBlogPosts(params?: BlogPostParams): Promise<HubSpotApiResponse<BlogListResponse>>;
  getBlogPostBySlug(slug: string): Promise<HubSpotApiResponse<BlogPost | null>>;
  getBlogPostById(id: string): Promise<HubSpotApiResponse<BlogPost | null>>;

  // Careers operations
  getCareers(params?: CareersParams): Promise<HubSpotApiResponse<CareersListResponse>>;
  getCareerById(id: string): Promise<HubSpotApiResponse<Career | null>>;

  // Community operations
  getCommunityActivities(params?: CommunityParams): Promise<HubSpotApiResponse<CommunityListResponse>>;
  getCommunityActivityById(id: string): Promise<HubSpotApiResponse<CommunityActivity | null>>;
  getCommunityActivityBySlug(slug: string): Promise<HubSpotApiResponse<CommunityActivity | null>>;

  // Team operations
  getTeamMembers(params?: TeamParams): Promise<HubSpotApiResponse<TeamListResponse>>;
  getTeamMemberById(id: string): Promise<HubSpotApiResponse<TeamMember | null>>;

  // Progressive profiling
  getContactProfile(email: string): Promise<ContactProfile>;
}

class HubSpotApiService implements HubSpotService {
  private contactsService: ContactsService;
  private dealsService: DealsService;
  private ticketsService: TicketsService;
  private notesService: NotesService;
  private blogService: BlogService;
  private careersService: CareersService;
  private communityService: CommunityService;
  private teamService: TeamService;
  private isConfigured: boolean;

  constructor() {
    const hubspotConfig = getServiceConfig('hubspot');

    if (!isServiceConfigured('hubspot') || hubspotConfig.mockMode) {
      console.warn('[HubSpot] API not configured or running in mock mode. Service will operate in mock mode.');
      this.isConfigured = false;
      this.contactsService = null as any;
      this.dealsService = null as any;
      this.ticketsService = null as any;
      this.notesService = null as any;
      this.blogService = null as any;
      this.careersService = null as any;
      this.communityService = null as any;
      this.teamService = null as any;
      return;
    }

    this.isConfigured = true;
    this.contactsService = new ContactsService(hubspotConfig.apiKey);
    this.dealsService = new DealsService(hubspotConfig.apiKey);
    this.ticketsService = new TicketsService(hubspotConfig.apiKey);
    this.notesService = new NotesService(hubspotConfig.apiKey);
    this.blogService = new BlogService(hubspotConfig.apiKey);
    this.careersService = new CareersService(hubspotConfig.apiKey);
    this.communityService = new CommunityService(hubspotConfig.apiKey);
    this.teamService = new TeamService(hubspotConfig.apiKey);

    console.log('[HubSpot] Service initialized successfully with production configuration');
  }

  /**
   * Create a new contact
   */
  async createContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    if (!this.isConfigured) {
      return this.mockCreateContact(contactData);
    }

    // Validate input
    const validatedData = validateContactInput(contactData);
    if (!validatedData) {
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid contact data provided',
        },
      };
    }

    return await this.contactsService.createContact(validatedData);
  }

  /**
   * Update an existing contact
   */
  async updateContact(
    contactId: string,
    updates: Partial<ContactInput>
  ): Promise<HubSpotApiResponse<Contact>> {
    if (!this.isConfigured) {
      return this.mockUpdateContact(contactId, updates);
    }

    return await this.contactsService.updateContact(contactId, updates);
  }

  /**
   * Find a contact by email
   */
  async findContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>> {
    if (!this.isConfigured) {
      return this.mockFindContactByEmail(email);
    }

    return await this.contactsService.findContactByEmail(email);
  }

  /**
   * Find a contact by email and name
   */
  async findContactByEmailAndName(email: string, firstname: string, lastname: string): Promise<HubSpotApiResponse<Contact | null>> {
    if (!this.isConfigured) {
      return this.mockFindContactByEmail(email); // Use same mock for now
    }

    return await this.contactsService.findContactByEmailAndName(email, firstname, lastname);
  }

  /**
   * Create a new deal
   */
  async createDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>> {
    if (!this.isConfigured) {
      return this.mockCreateDeal(dealData);
    }

    // Validate input
    const validatedData = validateDealInput(dealData);
    if (!validatedData) {
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid deal data provided',
        },
      };
    }

    return await this.dealsService.createDeal(validatedData);
  }

  /**
   * Update an existing deal
   */
  async updateDeal(
    dealId: string,
    updates: Partial<DealInput>
  ): Promise<HubSpotApiResponse<Deal>> {
    if (!this.isConfigured) {
      return this.mockUpdateDeal(dealId, updates);
    }

    return await this.dealsService.updateDeal(dealId, updates);
  }

  /**
   * Associate a contact with a deal
   */
  async associateContactToDeal(
    contactId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    if (!this.isConfigured) {
      return this.mockAssociateContactToDeal(contactId, dealId);
    }

    return await this.dealsService.associateContactToDeal(contactId, dealId);
  }

  /**
   * Create a new note
   */
  async createNote(noteData: NoteInput): Promise<HubSpotApiResponse<Note>> {
    if (!this.isConfigured) {
      return this.mockCreateNote(noteData);
    }

    return await this.notesService.createNote(noteData);
  }

  /**
   * Associate a note with a deal
   */
  async associateNoteToDeal(
    noteId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    if (!this.isConfigured) {
      return this.mockAssociateNoteToDeal(noteId, dealId);
    }

    return await this.notesService.associateNoteToDeal(noteId, dealId);
  }

  /**
   * Associate a note with a contact
   */
  async associateNoteToContact(
    noteId: string,
    contactId: string
  ): Promise<HubSpotApiResponse<void>> {
    if (!this.isConfigured) {
      return this.mockAssociateNoteToContact(noteId, contactId);
    }

    return await this.notesService.associateNoteToContact(noteId, contactId);
  }

  /**
   * Create a new ticket
   */
  async createTicket(ticketData: TicketInput): Promise<HubSpotApiResponse<Ticket>> {
    if (!this.isConfigured) {
      return this.mockCreateTicket(ticketData);
    }

    // Validate input
    const validatedData = validateTicketInput(ticketData);
    if (!validatedData) {
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid ticket data provided',
        },
      };
    }

    return await this.ticketsService.createTicket(validatedData);
  }

  /**
   * Associate a contact with a ticket
   */
  async associateContactToTicket(
    contactId: string,
    ticketId: string
  ): Promise<HubSpotApiResponse<void>> {
    if (!this.isConfigured) {
      return this.mockAssociateContactToTicket(contactId, ticketId);
    }

    return await this.ticketsService.associateContactToTicket(contactId, ticketId);
  }

  /**
   * Get contact profile for progressive profiling
   */
  async getContactProfile(email: string): Promise<ContactProfile> {
    try {
      const result = await this.findContactByEmail(email);
      
      if (result.success && result.data) {
        const knownFields = extractKnownFields(result.data);
        return {
          isReturning: true,
          knownFields,
          welcomeMessage: `Welcome back, ${result.data.properties.firstname || 'there'}!`,
        };
      }
      
      return { isReturning: false };
    } catch (error) {
      // Fail silently for progressive profiling
      console.warn('[HubSpot] Progressive profiling failed, showing regular form:', error);
      return { isReturning: false };
    }
  }

  /**
   * Get blog posts
   */
  async getBlogPosts(params?: BlogPostParams): Promise<HubSpotApiResponse<BlogListResponse>> {
    if (!this.isConfigured) {
      return this.mockGetBlogPosts(params);
    }

    return await this.blogService.getBlogPosts(params);
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<HubSpotApiResponse<BlogPost | null>> {
    if (!this.isConfigured) {
      return this.mockGetBlogPostBySlug(slug);
    }

    return await this.blogService.getBlogPostBySlug(slug);
  }

  /**
   * Get a single blog post by ID
   */
  async getBlogPostById(id: string): Promise<HubSpotApiResponse<BlogPost | null>> {
    if (!this.isConfigured) {
      return this.mockGetBlogPostById(id);
    }

    return await this.blogService.getBlogPostById(id);
  }

  /**
   * Get all career postings
   */
  async getCareers(params?: CareersParams): Promise<HubSpotApiResponse<CareersListResponse>> {
    if (!this.isConfigured) {
      return this.mockGetCareers(params);
    }

    return await this.careersService.getCareers(params);
  }

  /**
   * Get a single career posting by ID
   */
  async getCareerById(id: string): Promise<HubSpotApiResponse<Career | null>> {
    if (!this.isConfigured) {
      return this.mockGetCareerById(id);
    }

    return await this.careersService.getCareerById(id);
  }

  /**
   * Get all community activities
   */
  async getCommunityActivities(params?: CommunityParams): Promise<HubSpotApiResponse<CommunityListResponse>> {
    if (!this.isConfigured) {
      return this.mockGetCommunityActivities(params);
    }

    return await this.communityService.getCommunityActivities(params);
  }

  /**
   * Get a single community activity by ID
   */
  async getCommunityActivityById(id: string): Promise<HubSpotApiResponse<CommunityActivity | null>> {
    if (!this.isConfigured) {
      return this.mockGetCommunityActivityById(id);
    }

    return await this.communityService.getCommunityActivityById(id);
  }

  /**
   * Get a single community activity by slug
   */
  async getCommunityActivityBySlug(slug: string): Promise<HubSpotApiResponse<CommunityActivity | null>> {
    if (!this.isConfigured) {
      return this.mockGetCommunityActivityBySlug(slug);
    }

    return await this.communityService.getCommunityActivityBySlug(slug);
  }

  /**
   * Get all team members
   */
  async getTeamMembers(params?: TeamParams): Promise<HubSpotApiResponse<TeamListResponse>> {
    if (!this.isConfigured) {
      return this.mockGetTeamMembers(params);
    }

    return await this.teamService.getTeamMembers(params);
  }

  /**
   * Get a single team member by ID
   */
  async getTeamMemberById(id: string): Promise<HubSpotApiResponse<TeamMember | null>> {
    if (!this.isConfigured) {
      return this.mockGetTeamMemberById(id);
    }

    return await this.teamService.getTeamMemberById(id);
  }

  /**
   * Create or update contact with smart deduplication
   */
  async createOrUpdateContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    try {
      // First, try to find existing contact
      const existingContactResult = await this.findContactByEmail(contactData.email);

      if (existingContactResult.success && existingContactResult.data) {
        // Update existing contact
        const contactId = existingContactResult.data.id;
        console.log(`[HubSpot] Updating existing contact: ${contactId}`);
        return await this.updateContact(contactId, contactData);
      } else {
        // Create new contact
        console.log(`[HubSpot] Creating new contact for: ${contactData.email}`);
        return await this.createContact(contactData);
      }
    } catch (error: any) {
      console.error('[HubSpot] Error in createOrUpdateContact:', error);
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to create or update contact',
        },
      };
    }
  }

  // Mock implementations for when API is not configured
  private async mockCreateContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    console.log('[HubSpot Mock] Creating contact:', contactData.email);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockContact: Contact = {
      id: Math.random().toString(36).substring(2, 11),
      properties: {
        email: contactData.email,
        firstname: contactData.firstname,
        lastname: contactData.lastname,
        phone: contactData.phone,
        address: contactData.address,
        property_type: contactData.property_type,
        preferred_contact_method: contactData.preferred_contact_method.charAt(0).toUpperCase() + contactData.preferred_contact_method.slice(1).toLowerCase(),
        preferred_contact_time: contactData.preferred_contact_time ? contactData.preferred_contact_time.charAt(0).toUpperCase() + contactData.preferred_contact_time.slice(1).toLowerCase() : undefined,
        lead_source: contactData.lead_source,
        createdate: new Date().toISOString(),
        lastmodifieddate: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: mockContact,
    };
  }

  private async mockUpdateContact(
    contactId: string,
    updates: Partial<ContactInput>
  ): Promise<HubSpotApiResponse<Contact>> {
    console.log('[HubSpot Mock] Updating contact:', contactId);
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockContact: Contact = {
      id: contactId,
      properties: {
        email: updates.email || 'mock@example.com',
        firstname: updates.firstname || 'Mock',
        lastname: updates.lastname || 'User',
        phone: updates.phone || '',
        address: updates.address || '',
        property_type: updates.property_type || 'single_family',
        preferred_contact_method: updates.preferred_contact_method ? updates.preferred_contact_method.charAt(0).toUpperCase() + updates.preferred_contact_method.slice(1).toLowerCase() : 'Email',
        preferred_contact_time: updates.preferred_contact_time ? updates.preferred_contact_time.charAt(0).toUpperCase() + updates.preferred_contact_time.slice(1).toLowerCase() : undefined,
        lead_source: 'instant_estimate',
        createdate: new Date(Date.now() - 86400000).toISOString(),
        lastmodifieddate: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: mockContact,
    };
  }

  private async mockFindContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>> {
    console.log('[HubSpot Mock] Finding contact by email:', email);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock: return null for new emails, existing contact for known emails
    if (email.includes('existing')) {
      const mockContact: Contact = {
        id: 'mock-existing-contact',
        properties: {
          email,
          firstname: 'John',
          lastname: 'Doe',
          phone: '555-0123',
          address: '123 Main St',
          property_type: 'single_family',
          preferred_contact_method: 'Phone',
          preferred_contact_time: 'Morning',
          lead_source: 'instant_estimate',
          createdate: new Date(Date.now() - 86400000).toISOString(),
          lastmodifieddate: new Date().toISOString(),
        },
      };

      return {
        success: true,
        data: mockContact,
      };
    }

    return {
      success: true,
      data: null,
    };
  }

  private async mockCreateDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>> {
    console.log('[HubSpot Mock] Creating deal:', dealData.dealname);
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockDeal: Deal = {
      id: Math.random().toString(36).substring(2, 11),
      properties: {
        dealname: dealData.dealname,
        amount: dealData.amount,
        pipeline: dealData.pipeline,
        dealstage: dealData.dealstage,
        services_requested: dealData.services_requested,
        property_square_footage: dealData.property_square_footage?.toString(),
        estimate_min: dealData.estimate_min.toString(),
        estimate_max: dealData.estimate_max.toString(),
        is_emergency: dealData.is_emergency ? 'Yes' : 'No',
        project_timeline: dealData.project_timeline,
        // Contact preferences
        preferred_contact_method: dealData.preferred_contact_method,
        preferred_contact_time: dealData.preferred_contact_time,
        createdate: new Date().toISOString(),
        // New lead routing properties
        lead_priority: dealData.lead_priority,
        lead_score: dealData.lead_score?.toString(),
        services_count: dealData.services_count?.toString(),
        assigned_sales_rep: dealData.assigned_sales_rep,
        notification_sent: dealData.notification_sent?.toString(),
        project_description: dealData.project_description,
        property_type: dealData.property_type,
        location: dealData.location,
      },
    };

    return {
      success: true,
      data: mockDeal,
    };
  }

  private async mockUpdateDeal(
    dealId: string,
    updates: Partial<DealInput>
  ): Promise<HubSpotApiResponse<Deal>> {
    console.log('[HubSpot Mock] Updating deal:', dealId);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockDeal: Deal = {
      id: dealId,
      properties: {
        dealname: updates.dealname || 'Updated Deal',
        amount: updates.amount || '1000',
        pipeline: updates.pipeline,
        dealstage: updates.dealstage || 'estimate_submitted',
        services_requested: updates.services_requested || 'roof_repair',
        property_square_footage: updates.property_square_footage?.toString(),
        estimate_min: updates.estimate_min?.toString() || '500',
        estimate_max: updates.estimate_max?.toString() || '1500',
        is_emergency: updates.is_emergency !== undefined ? (updates.is_emergency ? 'Yes' : 'No') : 'No',
        project_timeline: updates.project_timeline,
        // Contact preferences - pass through as-is, capitalization happens in utils.ts
        preferred_contact_method: updates.preferred_contact_method,
        preferred_contact_time: updates.preferred_contact_time,
        createdate: new Date(Date.now() - 86400000).toISOString(),
        // New lead routing properties
        lead_priority: updates.lead_priority,
        lead_score: updates.lead_score?.toString(),
        services_count: updates.services_count?.toString(),
        assigned_sales_rep: updates.assigned_sales_rep,
        notification_sent: updates.notification_sent?.toString(),
        project_description: updates.project_description,
        property_type: updates.property_type,
        location: updates.location,
      },
    };

    return {
      success: true,
      data: mockDeal,
    };
  }

  private async mockAssociateContactToDeal(
    contactId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    console.log('[HubSpot Mock] Associating contact with deal:', { contactId, dealId });
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
    };
  }

  private async mockCreateNote(noteData: NoteInput): Promise<HubSpotApiResponse<Note>> {
    console.log('[HubSpot Mock] Creating note:', noteData.note.substring(0, 50));
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockNote: Note = {
      id: Math.random().toString(36).substring(2, 11),
      properties: {
        hs_note_body: noteData.note,
        hs_timestamp: (noteData.timestamp || Date.now()).toString(),
      },
    };

    return {
      success: true,
      data: mockNote,
    };
  }

  private async mockAssociateNoteToDeal(
    noteId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    console.log('[HubSpot Mock] Associating note with deal:', { noteId, dealId });
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
    };
  }

  private async mockAssociateNoteToContact(
    noteId: string,
    contactId: string
  ): Promise<HubSpotApiResponse<void>> {
    console.log('[HubSpot Mock] Associating note with contact:', { noteId, contactId });
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
    };
  }

  private async mockCreateTicket(ticketData: TicketInput): Promise<HubSpotApiResponse<Ticket>> {
    console.log('[HubSpot Mock] Creating ticket:', ticketData.subject);
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockTicket: Ticket = {
      id: Math.random().toString(36).substring(2, 11),
      properties: {
        subject: ticketData.subject,
        content: ticketData.content,
        hs_pipeline: ticketData.hs_pipeline,
        hs_pipeline_stage: ticketData.hs_pipeline_stage,
        hs_ticket_priority: ticketData.hs_ticket_priority,
        createdate: new Date().toISOString(),
        property_address: ticketData.property_address,
        property_type: ticketData.property_type,
        services_requested: ticketData.services_requested,
        estimate_min: ticketData.estimate_min?.toString(),
        estimate_max: ticketData.estimate_max?.toString(),
        is_emergency: ticketData.is_emergency?.toString(),
        project_timeline: ticketData.project_timeline,
        preferred_contact_method: ticketData.preferred_contact_method,
        preferred_contact_time: ticketData.preferred_contact_time,
      },
    };

    return {
      success: true,
      data: mockTicket,
    };
  }

  private async mockAssociateContactToTicket(
    contactId: string,
    ticketId: string
  ): Promise<HubSpotApiResponse<void>> {
    console.log('[HubSpot Mock] Associating contact with ticket:', { contactId, ticketId });
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
    };
  }

  private async mockGetBlogPosts(params?: BlogPostParams): Promise<HubSpotApiResponse<BlogListResponse>> {
    console.log('[HubSpot Mock] Getting blog posts:', params);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockPosts: BlogPost[] = [
      {
        id: '1',
        name: 'Expert Tips for Roof Maintenance',
        slug: 'expert-tips-roof-maintenance',
        state: 'PUBLISHED',
        featuredImage: '/placeholder.svg?height=300&width=400&query=roof maintenance professional inspection',
        postBody: '<p>Learn essential maintenance tips to extend your roof\'s lifespan...</p>',
        postSummary: 'Learn essential maintenance tips to extend your roof\'s lifespan and prevent costly repairs.',
        publishDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        created: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated: new Date(Date.now() - 86400000 * 3).toISOString(),
        authorName: 'Russell Roofing Team',
        url: '/news/expert-tips-roof-maintenance',
      },
      {
        id: '2',
        name: 'Choosing the Right Siding Material',
        slug: 'choosing-right-siding-material',
        state: 'PUBLISHED',
        featuredImage: '/placeholder.svg?height=300&width=400&query=home siding materials comparison',
        postBody: '<p>Compare different siding materials and find the perfect option...</p>',
        postSummary: 'Compare different siding materials and find the perfect option for your home\'s style and budget.',
        publishDate: new Date(Date.now() - 86400000 * 8).toISOString(),
        created: new Date(Date.now() - 86400000 * 12).toISOString(),
        updated: new Date(Date.now() - 86400000 * 6).toISOString(),
        authorName: 'Russell Roofing Team',
        url: '/news/choosing-right-siding-material',
      },
    ];

    return {
      success: true,
      data: {
        total: mockPosts.length,
        results: mockPosts.slice(0, params?.limit || 10),
      },
    };
  }

  private async mockGetBlogPostBySlug(slug: string): Promise<HubSpotApiResponse<BlogPost | null>> {
    console.log('[HubSpot Mock] Getting blog post by slug:', slug);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockPost: BlogPost = {
      id: '1',
      name: 'Expert Tips for Roof Maintenance',
      slug: slug,
      state: 'PUBLISHED',
      featuredImage: '/placeholder.svg?height=600&width=1200&query=roof maintenance',
      postBody: '<p>Full blog post content goes here...</p>',
      postSummary: 'Learn essential maintenance tips to extend your roof\'s lifespan.',
      publishDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      created: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated: new Date(Date.now() - 86400000 * 3).toISOString(),
      authorName: 'Russell Roofing Team',
      url: `/news/${slug}`,
    };

    return {
      success: true,
      data: mockPost,
    };
  }

  private async mockGetBlogPostById(id: string): Promise<HubSpotApiResponse<BlogPost | null>> {
    console.log('[HubSpot Mock] Getting blog post by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockPost: BlogPost = {
      id,
      name: 'Expert Tips for Roof Maintenance',
      slug: 'expert-tips-roof-maintenance',
      state: 'PUBLISHED',
      featuredImage: '/placeholder.svg?height=600&width=1200&query=roof maintenance',
      postBody: '<p>Full blog post content goes here...</p>',
      postSummary: 'Learn essential maintenance tips to extend your roof\'s lifespan.',
      publishDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      created: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated: new Date(Date.now() - 86400000 * 3).toISOString(),
      authorName: 'Russell Roofing Team',
      url: '/news/expert-tips-roof-maintenance',
    };

    return {
      success: true,
      data: mockPost,
    };
  }

  private async mockGetCareers(params?: CareersParams): Promise<HubSpotApiResponse<CareersListResponse>> {
    console.log('[HubSpot Mock] Getting careers with params:', params);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockCareers: Career[] = [
      {
        id: '1',
        properties: {
          job_title: 'Roofing Foreman',
          department: 'Field Operations',
          location: 'Oreland, PA',
          employment_type: 'Full-time',
          experience_level: '5+ years',
          salary_range: '$65,000 - $85,000',
          job_description: 'Lead construction teams and ensure project quality standards.',
          key_responsibilities: 'Supervise crews, Ensure quality standards, Communicate with clients, Train team members, Maintain documentation, Enforce safety protocols',
          requirements: '5+ years experience, Previous supervisory experience, Strong roofing knowledge, Excellent communication skills, Valid driver\'s license, OSHA 10 certification preferred',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 30).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      }
    ];

    return {
      success: true,
      data: {
        total: mockCareers.length,
        results: mockCareers,
      },
    };
  }

  private async mockGetCareerById(id: string): Promise<HubSpotApiResponse<Career | null>> {
    console.log('[HubSpot Mock] Getting career by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockCareer: Career = {
      id,
      properties: {
        job_title: 'Roofing Foreman',
        department: 'Field Operations',
        location: 'Oreland, PA',
        employment_type: 'Full-time',
        experience_level: '5+ years',
        salary_range: '$65,000 - $85,000',
        job_description: 'Lead construction teams and ensure project quality standards.',
        key_responsibilities: 'Supervise crews, Ensure quality standards, Communicate with clients, Train team members, Maintain documentation, Enforce safety protocols',
        requirements: '5+ years experience, Previous supervisory experience, Strong roofing knowledge, Excellent communication skills, Valid driver\'s license, OSHA 10 certification preferred',
        live: 'true',
        createdate: new Date(Date.now() - 86400000 * 30).toISOString(),
        hs_lastmodifieddate: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    };

    return {
      success: true,
      data: mockCareer,
    };
  }

  private async mockGetCommunityActivities(params?: CommunityParams): Promise<HubSpotApiResponse<CommunityListResponse>> {
    console.log('[HubSpot Mock] Getting community activities with params:', params);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockActivities: CommunityActivity[] = [
      {
        id: '1',
        properties: {
          name: 'Habitat for Humanity Partnership',
          description: 'Annual volunteer work providing roofing services for Habitat for Humanity home builds.',
          year: 2018,
          impact: 'Helped roof 12+ homes for families in need',
          image_url: '',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 365).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 30).toISOString(),
        }
      },
      {
        id: '2',
        properties: {
          name: 'Local Schools Support Program',
          description: 'Sponsoring local high school sports teams and providing scholarships for trade education.',
          year: 2019,
          impact: 'Supported 25+ students in pursuing construction education',
          image_url: '',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 300).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 20).toISOString(),
        }
      },
      {
        id: '3',
        properties: {
          name: 'Emergency Storm Relief',
          description: 'Providing free emergency roof repairs for elderly and disabled community members after severe weather.',
          year: 2020,
          impact: 'Completed 50+ emergency repairs at no cost',
          image_url: '',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 200).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 10).toISOString(),
        }
      }
    ];

    return {
      success: true,
      data: {
        total: mockActivities.length,
        results: mockActivities,
      },
    };
  }

  private async mockGetCommunityActivityById(id: string): Promise<HubSpotApiResponse<CommunityActivity | null>> {
    console.log('[HubSpot Mock] Getting community activity by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockActivity: CommunityActivity = {
      id,
      properties: {
        name: 'Habitat for Humanity Partnership',
        description: 'Annual volunteer work providing roofing services for Habitat for Humanity home builds.',
        year: 2018,
        impact: 'Helped roof 12+ homes for families in need',
        image_url: '',
        live: 'true',
        createdate: new Date(Date.now() - 86400000 * 365).toISOString(),
        hs_lastmodifieddate: new Date(Date.now() - 86400000 * 30).toISOString(),
      }
    };

    return {
      success: true,
      data: mockActivity,
    };
  }

  private async mockGetCommunityActivityBySlug(slug: string): Promise<HubSpotApiResponse<CommunityActivity | null>> {
    console.log('[HubSpot Mock] Getting community activity by slug:', slug);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockActivity: CommunityActivity = {
      id: 'mock-activity-1',
      properties: {
        name: 'Habitat for Humanity Partnership',
        description: 'Annual volunteer work providing roofing services for Habitat for Humanity home builds.',
        year: 2018,
        impact: 'Helped roof 12+ homes for families in need',
        image_url: '',
        slug: slug,
        summary: '<p>Our partnership with Habitat for Humanity has been a cornerstone of our community involvement efforts.</p>',
        live: 'true',
        createdate: new Date(Date.now() - 86400000 * 365).toISOString(),
        hs_lastmodifieddate: new Date(Date.now() - 86400000 * 30).toISOString(),
      }
    };

    return {
      success: true,
      data: mockActivity,
    };
  }

  private async mockGetTeamMembers(params?: TeamParams): Promise<HubSpotApiResponse<TeamListResponse>> {
    console.log('[HubSpot Mock] Getting team members');
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockTeamMembers: TeamMember[] = [
      {
        id: 'mock-team-1',
        properties: {
          employee_name: 'John Smith',
          employee_title: 'Project Manager',
          employee_description: 'Over 15 years of experience in roofing and exterior projects.',
          employee_phone_number: '(555) 123-4567',
          employee_photo: '',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 365).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 30).toISOString(),
        }
      },
      {
        id: 'mock-team-2',
        properties: {
          employee_name: 'Sarah Johnson',
          employee_title: 'Lead Estimator',
          employee_description: 'Specialist in residential and commercial roofing estimates.',
          employee_phone_number: '(555) 234-5678',
          employee_photo: '',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 300).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 20).toISOString(),
        }
      },
      {
        id: 'mock-team-3',
        properties: {
          employee_name: 'Mike Davis',
          employee_title: 'Operations Manager',
          employee_description: 'Ensures quality and efficiency in all our projects.',
          employee_phone_number: '(555) 345-6789',
          employee_photo: '',
          live: 'true',
          createdate: new Date(Date.now() - 86400000 * 200).toISOString(),
          hs_lastmodifieddate: new Date(Date.now() - 86400000 * 10).toISOString(),
        }
      }
    ];

    return {
      success: true,
      data: {
        total: mockTeamMembers.length,
        results: mockTeamMembers,
      },
    };
  }

  private async mockGetTeamMemberById(id: string): Promise<HubSpotApiResponse<TeamMember | null>> {
    console.log('[HubSpot Mock] Getting team member by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockTeamMember: TeamMember = {
      id: id,
      properties: {
        employee_name: 'John Smith',
        employee_title: 'Project Manager',
        employee_description: 'Over 15 years of experience in roofing and exterior projects.',
        employee_phone_number: '(555) 123-4567',
        employee_photo: '',
        live: 'true',
        createdate: new Date(Date.now() - 86400000 * 365).toISOString(),
        hs_lastmodifieddate: new Date(Date.now() - 86400000 * 30).toISOString(),
      }
    };

    return {
      success: true,
      data: mockTeamMember,
    };
  }
}

// Export singleton instance
export const hubspotService = new HubSpotApiService();
export default hubspotService;