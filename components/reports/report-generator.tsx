'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { exportToExcel } from '@/lib/reports';

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'sales', label: 'Sales Analytics', icon: BarChart3 },
    { value: 'inventory', label: 'Inventory Report', icon: FileText },
    { value: 'customers', label: 'Customer Report', icon: FileText },
    { value: 'revenue', label: 'Revenue Analysis', icon: BarChart3 },
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }

    setLoading(true);

    try {
      let endpoint = '';
      let filename = '';

      switch (reportType) {
        case 'sales':
          endpoint = '/api/reports/sales';
          filename = `sales-report-${format(new Date(), 'yyyy-MM-dd')}`;
          break;
        case 'inventory':
          endpoint = '/api/reports/inventory';
          filename = `inventory-report-${format(new Date(), 'yyyy-MM-dd')}`;
          break;
        case 'customers':
          endpoint = '/api/reports/customers';
          filename = `customer-report-${format(new Date(), 'yyyy-MM-dd')}`;
          break;
        case 'revenue':
          endpoint = '/api/reports/revenue';
          filename = `revenue-report-${format(new Date(), 'yyyy-MM-dd')}`;
          break;
      }

      const params = new URLSearchParams();
      if (dateRange.from) params.append('from', dateRange.from.toISOString());
      if (dateRange.to) params.append('to', dateRange.to.toISOString());

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      if (data.length === 0) {
        toast.error('No data available for the selected criteria');
        return;
      }

      exportToExcel(data, filename);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Generator</h2>
        <p className="text-gray-600">Generate and download comprehensive business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label>Report Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setReportType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      reportType === type.value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-sky-500" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600">
                          {type.value === 'sales' && 'Daily, weekly, and monthly sales data'}
                          {type.value === 'inventory' && 'Stock levels and inventory movements'}
                          {type.value === 'customers' && 'Customer analytics and purchase history'}
                          {type.value === 'revenue' && 'Revenue trends and profit analysis'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Selection */}
          {(reportType === 'sales' || reportType === 'revenue') && (
            <div className="space-y-4">
              <Label>Date Range (Optional)</Label>
              <div className="flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange.from ? format(dateRange.from, 'PPP') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange.to ? format(dateRange.to, 'PPP') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateReport}
            disabled={!reportType || loading}
            className="w-full bg-sky-500 hover:bg-sky-600"
            size="lg"
          >
            {loading ? (
              'Generating...'
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate & Download Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setReportType('sales');
                setDateRange({
                  from: new Date(new Date().setDate(new Date().getDate() - 7)),
                  to: new Date(),
                });
                generateReport();
              }}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Last 7 Days</div>
                <div className="text-sm text-gray-600">Sales Report</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setReportType('inventory');
                generateReport();
              }}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Current Stock</div>
                <div className="text-sm text-gray-600">Inventory Report</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setReportType('customers');
                generateReport();
              }}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">All Customers</div>
                <div className="text-sm text-gray-600">Customer Report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}