#!/usr/bin/env node

/**
 * Populate Community Involvement activities with test data
 * NOTE: Update COMMUNITY_OBJECT_TYPE_ID after running setup-community-hubspot.js
 */

const https = require('https');

const apiKey = process.env.HUBSPOT_API_KEY;
const COMMUNITY_OBJECT_TYPE_ID = '2-51945309';

if (!apiKey) {
  console.error('ERROR: HUBSPOT_API_KEY not found in environment');
  console.error('Please set HUBSPOT_API_KEY in your .env.local file');
  process.exit(1);
}

if (COMMUNITY_OBJECT_TYPE_ID === 'UPDATE_ME') {
  console.error('ERROR: Please update COMMUNITY_OBJECT_TYPE_ID in this script');
  console.error('Run setup-community-hubspot.js first to get the Object Type ID');
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
  console.log('📝 Populating Community Involvement activities...\n');

  try {
    const activities = [
      {
        name: 'Habitat for Humanity Partnership',
        description: 'Annual volunteer work providing roofing services for Habitat for Humanity home builds.',
        year: 2018,
        impact: 'Helped roof 12+ homes for families in need',
        image_url: '',
        live: 'true'
      },
      {
        name: 'Local Schools Support Program',
        description: 'Sponsoring local high school sports teams and providing scholarships for trade education.',
        year: 2019,
        impact: 'Supported 25+ students in pursuing construction education',
        image_url: '',
        live: 'true'
      },
      {
        name: 'Emergency Storm Relief',
        description: 'Providing free emergency roof repairs for elderly and disabled community members after severe weather.',
        year: 2020,
        impact: 'Completed 50+ emergency repairs at no cost',
        image_url: '',
        live: 'true'
      }
    ];

    console.log(`Creating ${activities.length} community activities...\n`);

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      console.log(`${i + 1}. Creating: ${activity.name}...`);

      const activityData = {
        properties: activity
      };

      const result = await makeRequest(
        'POST',
        `/crm/v3/objects/${COMMUNITY_OBJECT_TYPE_ID}`,
        activityData
      );

      console.log(`   ✅ Created with ID: ${result.id}`);
      console.log(`   📅 Year: ${result.properties.year}`);
      console.log(`   💡 Impact: ${result.properties.impact}`);
      console.log('');
    }

    console.log('🎉 All community activities created successfully!');
    console.log('\nYou can now view them in HubSpot or on your website at:');
    console.log('http://localhost:3000/community');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
