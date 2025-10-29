import { Client } from '@hubspot/api-client';
import { HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';

export interface NoteInput {
  note: string;
  timestamp?: number;
}

export interface Note {
  id: string;
  properties: {
    hs_note_body: string;
    hs_timestamp: string;
  };
}

class NotesService {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ accessToken: apiKey });
  }

  /**
   * Create a note engagement
   */
  async createNote(noteData: NoteInput): Promise<HubSpotApiResponse<Note>> {
    try {
      const timestamp = noteData.timestamp || Date.now();

      const response = await this.client.crm.objects.notes.basicApi.create({
        properties: {
          hs_note_body: noteData.note,
          hs_timestamp: timestamp.toString(),
        },
      });

      const note: Note = {
        id: response.id,
        properties: {
          hs_note_body: response.properties.hs_note_body || noteData.note,
          hs_timestamp: response.properties.hs_timestamp || timestamp.toString(),
        },
      };

      return {
        success: true,
        data: note,
      };
    } catch (error: any) {
      console.error('[HubSpot Notes] Error creating note:', error);
      return {
        success: false,
        error: {
          status: error.code || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to create note',
          correlationId: error.body?.correlationId,
        },
      };
    }
  }

  /**
   * Associate a note with a deal
   */
  async associateNoteToDeal(noteId: string, dealId: string): Promise<HubSpotApiResponse<void>> {
    try {
      await this.client.crm.associations.batchApi.create(
        'notes',
        'deals',
        {
          inputs: [{
            _from: { id: noteId },
            to: { id: dealId },
            type: 'note_to_deal'
          }]
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error('[HubSpot Notes] Error associating note to deal:', error);
      return {
        success: false,
        error: {
          status: error.code || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to associate note to deal',
          correlationId: error.body?.correlationId,
        },
      };
    }
  }

  /**
   * Associate a note with a contact
   */
  async associateNoteToContact(noteId: string, contactId: string): Promise<HubSpotApiResponse<void>> {
    try {
      await this.client.crm.associations.batchApi.create(
        'notes',
        'contacts',
        {
          inputs: [{
            _from: { id: noteId },
            to: { id: contactId },
            type: 'note_to_contact'
          }]
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error('[HubSpot Notes] Error associating note to contact:', error);
      return {
        success: false,
        error: {
          status: error.code || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to associate note to contact',
          correlationId: error.body?.correlationId,
        },
      };
    }
  }
}

export default NotesService;
