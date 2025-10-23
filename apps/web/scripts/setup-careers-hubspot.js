#!/usr/bin/env node

/**
 * Setup script for HubSpot Careers Custom Object
 * 1. Finds the Careers custom object
 * 2. Adds a "live" boolean property if it doesn't exist
 * 3. Marks all existing career records as live
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
  console.log('🔍 Step 1: Finding Careers custom object...\n');

  try {
    // Get all custom objects
    const schemas = await makeRequest('GET', '/crm/v3/schemas');

    // Find Careers object
    const careersObject = schemas.results?.find(obj =>
      obj.name?.toLowerCase().includes('career') ||
      obj.labels?.singular?.toLowerCase().includes('career') ||
      obj.labels?.plural?.toLowerCase().includes('career')
    );

    if (!careersObject) {
      console.error('❌ No Careers custom object found in HubSpot');
      console.error('Please create a "Careers" custom object first in HubSpot Settings');
      process.exit(1);
    }

    const objectTypeId = careersObject.objectTypeId;
    console.log(`✅ Found Careers object: ${careersObject.labels.singular} (${objectTypeId})\n`);

    // Get property groups for this object
    console.log('🔍 Fetching property groups...\n');
    const propertyGroupsData = await makeRequest('GET', `/crm/v3/properties/${objectTypeId}`);
    const propertyGroups = propertyGroupsData.results
      .map(p => p.groupName)
      .filter((v, i, a) => v && a.indexOf(v) === i); // unique groups

    console.log('Available property groups:', propertyGroups.join(', '));
    console.log('');

    // Step 2: Check if 'live' property exists, if not create it
    console.log('🔍 Step 2: Checking for "live" property...\n');

    const existingProperty = careersObject.properties?.find(prop => prop.name === 'live');

    if (existingProperty) {
      console.log('✅ "live" property already exists\n');
    } else {
      console.log('📝 Creating "live" boolean property...');

      // Use the first available property group
      const propertyGroup = propertyGroups[0];

      if (!propertyGroup) {
        console.error('❌ No property groups found. Please create at least one property in HubSpot first.');
        process.exit(1);
      }

      const propertyDef = {
        name: 'live',
        label: 'Live',
        type: 'bool',
        fieldType: 'booleancheckbox',
        groupName: propertyGroup,
        description: 'Whether this job posting should be displayed on the website',
        options: [
          { label: 'Yes', value: 'true', hidden: false, displayOrder: 0 },
          { label: 'No', value: 'false', hidden: false, displayOrder: 1 }
        ]
      };

      await makeRequest('POST', `/crm/v3/properties/${objectTypeId}`, propertyDef);
      console.log('✅ "live" property created successfully\n');
    }

    // Step 3: Get all career records and mark them as live
    console.log('🔍 Step 3: Finding career records...\n');

    const records = await makeRequest('GET', `/crm/v3/objects/${objectTypeId}?limit=100&properties=live`);

    if (!records.results || records.results.length === 0) {
      console.log('ℹ️  No career records found. You can add them in HubSpot.\n');
      console.log('✅ Setup complete!');
      return;
    }

    console.log(`📋 Found ${records.results.length} career record(s)\n`);

    // Mark all as live
    console.log('📝 Marking all records as live...\n');

    for (const record of records.results) {
      const isLive = record.properties.live === 'true';

      if (isLive) {
        console.log(`  ✓ Record ${record.id} already marked as live`);
      } else {
        await makeRequest('PATCH', `/crm/v3/objects/${objectTypeId}/${record.id}`, {
          properties: { live: true }
        });
        console.log(`  ✓ Record ${record.id} marked as live`);
      }
    }

    console.log('\n✅ All records marked as live!');
    console.log('\n🎉 Setup complete! You can now connect the Careers page to HubSpot.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
