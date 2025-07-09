"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const REPORT_TYPES = [
  { value: 'collection', label: 'Milk Collection' },
  { value: 'payments', label: 'Payments' },
  { value: 'quality', label: 'Quality' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('collection');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [farmers, setFarmers] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
    fetchDeliveries();
    fetchPayments();
  }, []);

  const fetchFarmers = async () => {
    const res = await fetch('/api/farmers');
    if (res.ok) setFarmers(await res.json());
  };
  const fetchDeliveries = async () => {
    const res = await fetch('/api/deliveries');
    if (res.ok) setDeliveries(await res.json());
    setLoading(false);
  };
  const fetchPayments = async () => {
    const res = await fetch('/api/payments?start=1900-01-01&end=2100-01-01');
    if (res.ok) setPayments(await res.json());
  };

  // Filtered data for the selected date range
  const filteredDeliveries = deliveries.filter(d =>
    isWithinInterval(parseISO(d.date), { start: parseISO(startDate), end: parseISO(endDate) })
  );
  const filteredPayments = payments.filter(p =>
    p.paymentDate && isWithinInterval(parseISO(p.paymentDate), { start: parseISO(startDate), end: parseISO(endDate) })
  );

  // Report data
  let tableHeaders: string[] = [];
  let tableRows: any[] = [];

  if (reportType === 'collection') {
    tableHeaders = ['Farmer', 'Date', 'Quantity (L)', 'Quality', 'Center'];
    tableRows = filteredDeliveries.map(d => [
      `${d.farmer?.name || ''} (${d.farmer?.farmerId || ''})`,
      format(new Date(d.date), 'yyyy-MM-dd'),
      d.quantity,
      d.quality,
      d.collectionCenter?.name || '-',
    ]);
  } else if (reportType === 'payments') {
    tableHeaders = ['Farmer', 'Period', 'Total Liters', 'Total Amount', 'Status', 'Payment Date'];
    tableRows = filteredPayments.map(p => [
      `${p.farmer?.name || ''} (${p.farmer?.farmerId || ''})`,
      p.period,
      p.totalQuantity,
      p.totalAmount,
      p.status,
      p.paymentDate ? format(new Date(p.paymentDate), 'yyyy-MM-dd') : '',
    ]);
  } else if (reportType === 'quality') {
    tableHeaders = ['Farmer', 'Date', 'Quality', 'Quantity (L)'];
    tableRows = filteredDeliveries.map(d => [
      `${d.farmer?.name || ''} (${d.farmer?.farmerId || ''})`,
      format(new Date(d.date), 'yyyy-MM-dd'),
      d.quality,
      d.quantity,
    ]);
  }

  const exportToExcel = () => {
    const data = [tableHeaders, ...tableRows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `report_${reportType}_${startDate}_${endDate}.xlsx`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-600">Generate and export detailed reports</p>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-medium">Report Type:</label>
          <select value={reportType} onChange={e => setReportType(e.target.value)} className="border rounded px-2 py-1">
            {REPORT_TYPES.map(rt => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
          <label className="font-medium ml-4">Start:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
          <label className="font-medium ml-2">End:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
          <Button onClick={exportToExcel} variant="outline">Export to Excel</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{REPORT_TYPES.find(rt => rt.value === reportType)?.label} Report</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chart Section */}
          <div className="mb-8">
            {reportType === 'collection' && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredDeliveries.map(d => ({
                  date: format(new Date(d.date), 'yyyy-MM-dd'),
                  quantity: d.quantity
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value: number) => [`${value}L`, 'Quantity']} />
                  <Line type="monotone" dataKey="quantity" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            {reportType === 'payments' && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredPayments.map(p => ({
                  period: p.period,
                  totalAmount: p.totalAmount
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value: number) => [`$${value}`, 'Total Amount']} />
                  <Bar dataKey="totalAmount" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {reportType === 'quality' && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(filteredDeliveries.reduce((acc: any, d: any) => {
                      acc[d.quality] = (acc[d.quality] || 0) + d.quantity;
                      return acc;
                    }, {})).map(([quality, quantity]) => ({ name: quality, value: quantity }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {Object.entries(filteredDeliveries.reduce((acc: any, d: any) => {
                      acc[d.quality] = (acc[d.quality] || 0) + d.quantity;
                      return acc;
                    }, {})).map(([quality], idx) => (
                      <Cell key={quality} fill={["#0ea5e9", "#fbbf24", "#10b981", "#ef4444"][idx % 4]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(value: number) => [`${value}L`, 'Quantity']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={tableHeaders.length} className="text-center py-8">Loading...</td></tr>
                ) : tableRows.length === 0 ? (
                  <tr><td colSpan={tableHeaders.length} className="text-center py-8">No data found.</td></tr>
                ) : (
                  tableRows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      {row.map((cell: any, j: number) => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap">{cell}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 