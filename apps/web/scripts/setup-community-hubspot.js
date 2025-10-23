#!/usr/bin/env node

/**
 * Create Community Involvement custom object in HubSpot
 * This script creates the custom object and its initial properties
 */

const https = require('https');

const apiKey = process.env.HUBSPOT_API_KEY;

if (!apiKey) {
  console.error('ERROR: HUBSPOT_API_KEY not found in environment');
  console.error('Please set HUBSPOT_API_KEY in your .env.local file');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.hubapi.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('🚀 Creating Community Involvement custom object in HubSpot...\n');

  try {
    // Step 1: Create the custom object schema
    console.log('📋 Step 1: Creating custom object schema...');

    const schemaData = {
      name: 'community_involvement',
      description: 'Community involvement activities and partnerships',
      labels: {
        singular: 'Community Activity',
        plural: 'Community Activities'
      },
      primaryDisplayProperty: 'name',
      requiredProperties: ['name'],
      searchableProperties: ['name', 'description'],
      properties: [
        {
          name: 'name',
          label: 'Activity Name',
          type: 'string',
          fieldType: 'text',
          description: 'Name of the community activity or partnership',
          hasUniqueValue: false,
          hidden: false
        },
        {
          name: 'description',
          label: 'Description',
          type: 'string',
          fieldType: 'textarea',
          description: 'Detailed description of the community involvement activity'
        },
        {
          name: 'year',
          label: 'Year',
          type: 'number',
          fieldType: 'number',
          description: 'Year the activity started or took place'
        },
        {
          name: 'impact',
          label: 'Impact',
          type: 'string',
          fieldType: 'textarea',
          description: 'Measurable impact of the activity (e.g., "Helped roof 12+ homes")'
        },
        {
          name: 'image_url',
          label: 'Image URL',
          type: 'string',
          fieldType: 'text',
          description: 'URL to the activity image (optional)'
        },
        {
          name: 'live',
          label: 'Live',
          type: 'bool',
          fieldType: 'booleancheckbox',
          description: 'Whether this activity should be displayed on the website',
          options: [
            { label: 'Yes', value: 'true', hidden: false, displayOrder: 0 },
            { label: 'No', value: 'false', hidden: false, displayOrder: 1 }
          ]
        }
      ],
      associatedObjects: ['CONTACT']
    };

    const schema = await makeRequest('POST', '/crm/v3/schemas', schemaData);
    console.log('✅ Custom object created successfully!');
    console.log(`   Object Type ID: ${schema.objectTypeId}`);
    console.log(`   Name: ${schema.name}`);
    console.log('');

    // Step 2: Get the object type ID for reference
    console.log('📝 Custom Object Details:');
    console.log('─────────────────────────────────────────────');
    console.log(`Object Type ID: ${schema.objectTypeId}`);
    console.log(`Full Name: ${schema.fullyQualifiedName}`);
    console.log(`API Name: ${schema.name}`);
    console.log('');

    console.log('✅ Setup complete!');
    console.log('');
    console.log('📌 Save this Object Type ID for your code:');
    console.log(`   COMMUNITY_OBJECT_TYPE_ID = '${schema.objectTypeId}'`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: node scripts/populate-community-data.js');
    console.log('2. Update src/lib/hubspot/community.ts with the Object Type ID');

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n💡 The Community Involvement object may already exist.');
      console.log('   You can check existing schemas at:');
      console.log('   https://developers.hubspot.com/docs/api/crm/crm-custom-objects');
    }

    process.exit(1);
  }
}

main();
