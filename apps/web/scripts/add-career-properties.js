#!/usr/bin/env node

/**
 * Add missing properties to HubSpot Careers Custom Object
 */

const https = require('https');

const apiKey = process.env.HUBSPOT_API_KEY;
const CAREERS_OBJECT_TYPE_ID = '2-51900429';

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
  console.log('🔍 Adding missing properties to Careers custom object...\n');

  try {
    // Get property groups
    const propertyGroupsData = await makeRequest('GET', `/crm/v3/properties/${CAREERS_OBJECT_TYPE_ID}`);
    const propertyGroups = propertyGroupsData.results
      .map(p => p.groupName)
      .filter((v, i, a) => v && a.indexOf(v) === i);

    const propertyGroup = propertyGroups[0];
    console.log(`✅ Using property group: ${propertyGroup}\n`);

    // Define properties to create
    const properties = [
      {
        name: 'department',
        label: 'Department',
        type: 'string',
        fieldType: 'text',
        description: 'Department or division (e.g., Field Operations, Project Management)'
      },
      {
        name: 'employment_type',
        label: 'Employment Type',
        type: 'string',
        fieldType: 'text',
        description: 'Employment type (e.g., Full-time, Part-time, Contract)'
      },
      {
        name: 'experience_level',
        label: 'Experience Level',
        type: 'string',
        fieldType: 'text',
        description: 'Required experience level (e.g., 5+ years, Entry Level)'
      },
      {
        name: 'salary_range',
        label: 'Salary Range',
        type: 'string',
        fieldType: 'text',
        description: 'Salary range or hourly rate (e.g., $65,000 - $85,000, $18 - $25/hour)'
      }
    ];

    // Create each property
    for (const prop of properties) {
      try {
        console.log(`📝 Creating property: ${prop.name}...`);

        const propertyDef = {
          ...prop,
          groupName: propertyGroup
        };

        await makeRequest('POST', `/crm/v3/properties/${CAREERS_OBJECT_TYPE_ID}`, propertyDef);
        console.log(`  ✅ Created: ${prop.label}`);
      } catch (error) {
        if (error.message.includes('PROPERTY_ALREADY_EXISTS')) {
          console.log(`  ⏭️  Skipped: ${prop.label} (already exists)`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n🎉 All properties added successfully!');
    console.log('\nYou can now run: node scripts/populate-foreman-job.js');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
