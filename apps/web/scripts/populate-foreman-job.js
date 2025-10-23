#!/usr/bin/env node

/**
 * Populate Foreman job posting with complete data
 */

const https = require('https');

const apiKey = process.env.HUBSPOT_API_KEY;
const CAREERS_OBJECT_TYPE_ID = '2-51900429';
const FOREMAN_RECORD_ID = '37502460509';

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
  console.log('📝 Populating Foreman job posting with complete data...\n');

  try {
    const jobData = {
      properties: {
        job_title: 'FOREMAN',
        department: 'Field Operations',
        location: 'Oreland, PA',
        employment_type: 'Full-time',
        experience_level: '5+ years',
        salary_range: '$65,000 - $85,000',
        job_description: 'Lead construction teams and ensure project quality standards. Oversee daily operations, manage crew schedules, and maintain safety protocols on residential and commercial roofing projects.',
        key_responsibilities: 'Supervise and coordinate work crews on roofing projects, Ensure all work meets company quality standards and safety requirements, Communicate with project managers and clients regarding progress, Train and mentor junior team members, Maintain accurate project documentation and reports, Enforce safety protocols and OSHA compliance',
        requirements: '5+ years of roofing or construction experience, Previous supervisory or leadership experience, Strong knowledge of roofing materials and techniques, Excellent communication and organizational skills, Valid driver\'s license and reliable transportation, OSHA 10 certification preferred',
        live: 'true'
      }
    };

    console.log('Updating record:', FOREMAN_RECORD_ID);
    console.log('With data:');
    console.log(JSON.stringify(jobData.properties, null, 2));
    console.log('');

    const result = await makeRequest(
      'PATCH',
      `/crm/v3/objects/${CAREERS_OBJECT_TYPE_ID}/${FOREMAN_RECORD_ID}`,
      jobData
    );

    console.log('✅ Successfully updated Foreman job posting!');
    console.log('\nUpdated properties:');
    console.log('- Job Title:', result.properties.job_title);
    console.log('- Department:', result.properties.department);
    console.log('- Location:', result.properties.location);
    console.log('- Employment Type:', result.properties.employment_type);
    console.log('- Experience Level:', result.properties.experience_level);
    console.log('- Salary Range:', result.properties.salary_range);
    console.log('- Live:', result.properties.live);
    console.log('\n🎉 Job posting is now fully populated and ready to display!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
