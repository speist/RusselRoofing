import { NextRequest, NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/env-validation';
import { getApiHealthStatus } from '@/lib/middleware/env-check';

export async function GET(request: NextRequest) {
  try {
    // Get overall environment validation
    const envValidation = validateEnvironment();
    
    // Get API-specific health status
    const apiHealth = getApiHealthStatus();
    
    // Determine overall health status
    const isHealthy = envValidation.isValid && apiHealth.status !== 'unhealthy';
    const status = isHealthy ? 200 : 503;
    
    // Create comprehensive health report
    const healthReport = {
      status: apiHealth.status,
      timestamp: new Date().toISOString(),
      environment: {
        node_env: process.env.NODE_ENV,
        validation: {
          is_valid: envValidation.isValid,
          total_variables: envValidation.summary.total,
          required_variables: envValidation.summary.required,
          configured_variables: envValidation.summary.configured,
          missing_variables: envValidation.summary.missing,
          errors: envValidation.errors,
          warnings: envValidation.warnings
        }
      },
      services: {
        summary: apiHealth.summary,
        details: apiHealth.services
      },
      checks: {
        environment_variables: envValidation.isValid ? 'PASS' : 'FAIL',
        api_services: apiHealth.status === 'unhealthy' ? 'FAIL' : 'PASS',
        critical_services: apiHealth.summary.unhealthy_services === 0 ? 'PASS' : 'FAIL'
      }
    };
    
    return NextResponse.json(healthReport, { status });
    
  } catch (error: any) {
    console.error('[Health Check] Unexpected error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error.message,
      checks: {
        environment_variables: 'ERROR',
        api_services: 'ERROR',
        critical_services: 'ERROR'
      }
    }, { status: 500 });
  }
}