'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Using simple text icons instead of lucide-react for broader compatibility
const Icons = {
  TrendingUp: () => <span className="text-green-500">📈</span>,
  TrendingDown: () => <span className="text-red-500">📉</span>,
  AlertTriangle: () => <span className="text-red-500">⚠️</span>,
  Star: () => <span className="text-yellow-500">⭐</span>,
  Users: () => <span className="text-blue-500">👥</span>,
  Target: () => <span className="text-green-500">🎯</span>,
  DollarSign: () => <span className="text-green-500">💰</span>,
  Clock: () => <span className="text-blue-500">🕐</span>
};

interface LeadMetrics {
  totalLeads: number;
  averageScore: number;
  highValueLeads: number;
  emergencyLeads: number;
  conversionRate: number;
  responseTime: number;
  totalValue: number;
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

interface LeadData {
  id: string;
  customerName: string;
  score: number;
  priority: 'emergency' | 'high' | 'medium' | 'low';
  estimateValue: number;
  services: string[];
  assignedRep: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
}

export default function LeadScoringDashboard() {
  const [metrics, setMetrics] = useState<LeadMetrics | null>(null);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const mockMetrics: LeadMetrics = {
        totalLeads: 47,
        averageScore: 68,
        highValueLeads: 12,
        emergencyLeads: 3,
        conversionRate: 34.2,
        responseTime: 2.3,
        totalValue: 485000,
        scoreDistribution: [
          { range: '0-25', count: 8, percentage: 17 },
          { range: '26-50', count: 15, percentage: 32 },
          { range: '51-75', count: 18, percentage: 38 },
          { range: '76-100', count: 6, percentage: 13 }
        ]
      };

      const mockLeads: LeadData[] = [
        {
          id: 'deal-001',
          customerName: 'John Smith',
          score: 92,
          priority: 'high',
          estimateValue: 35000,
          services: ['Roof Replacement', 'Gutters'],
          assignedRep: 'Senior Sales Rep',
          createdAt: '2025-01-24T10:30:00Z',
          status: 'new'
        },
        {
          id: 'deal-002',
          customerName: 'ABC Construction',
          score: 88,
          priority: 'high',
          estimateValue: 78000,
          services: ['Commercial Roofing'],
          assignedRep: 'Commercial Specialist',
          createdAt: '2025-01-24T09:15:00Z',
          status: 'contacted'
        },
        {
          id: 'deal-003',
          customerName: 'Emergency Repair LLC',
          score: 75,
          priority: 'emergency',
          estimateValue: 8500,
          services: ['Emergency Repair'],
          assignedRep: 'Emergency Dispatcher',
          createdAt: '2025-01-24T08:45:00Z',
          status: 'qualified'
        }
      ];

      setMetrics(mockMetrics);
      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityVariant = (priority: string): "primary" | "secondary" | "success" | "warning" | "error" | "info" => {
    switch (priority) {
      case 'emergency': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Scoring Dashboard</h1>
          <p className="text-gray-600">Monitor lead quality and sales performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Icons.Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              <Icons.TrendingUp /> +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Icons.Star />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.averageScore}/100</div>
            <Progress value={metrics?.averageScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Value Leads</CardTitle>
            <Icons.Target />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.highValueLeads}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics?.highValueLeads || 0) / (metrics?.totalLeads || 1) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Leads</CardTitle>
            <Icons.AlertTriangle />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics?.emergencyLeads}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icons.TrendingUp />
              <span className="ml-2">Conversion Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics?.conversionRate}%</div>
            <p className="text-sm text-muted-foreground">Leads to closed deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icons.Clock />
              <span className="ml-2">Avg Response Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics?.responseTime}h</div>
            <p className="text-sm text-muted-foreground">First contact to lead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icons.DollarSign />
              <span className="ml-2">Total Pipeline Value</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(metrics?.totalValue || 0)}
            </div>
            <p className="text-sm text-muted-foreground">Active leads value</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Recent Leads</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent High-Priority Leads</CardTitle>
              <CardDescription>Leads requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads
                  .filter(lead => lead.priority === 'emergency' || lead.priority === 'high')
                  .map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{lead.customerName}</span>
                          <Badge variant={getPriorityVariant(lead.priority)}>
                            {lead.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {lead.services.join(', ')} • {formatDate(lead.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}/100
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(lead.estimateValue)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{lead.assignedRep}</div>
                        <Badge variant="primary">{lead.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Score Distribution</CardTitle>
              <CardDescription>Distribution of lead scores across ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.scoreDistribution.map((range) => (
                  <div key={range.range} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score {range.range}</span>
                      <span>{range.count} leads ({range.percentage}%)</span>
                    </div>
                    <Progress value={range.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Performance Analysis</CardTitle>
              <CardDescription>Analysis of lead scoring effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">High-Score Lead Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate (80+ score)</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Deal Value (80+ score)</span>
                      <span className="text-sm font-medium">{formatCurrency(28500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Response Time (80+ score)</span>
                      <span className="text-sm font-medium">1.2 hours</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Low-Score Lead Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate (0-50 score)</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Deal Value (0-50 score)</span>
                      <span className="text-sm font-medium">{formatCurrency(8200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Response Time (0-50 score)</span>
                      <span className="text-sm font-medium">4.8 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}