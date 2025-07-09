"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, addDays, subDays, isWithinInterval } from 'date-fns';
import * as XLSX from 'xlsx';

interface Farmer {
  id: string;
  name: string;
  farmerId: string;
  pricePerL: number;
}

interface PaymentRow {
  farmer: Farmer;
  totalLiters: number;
  totalAmount: number;
  status: string;
  paymentDate: string | null;
  paid: boolean;
}

interface Payment {
  id: string;
  farmerId: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  ratePerLiter: number;
  status: string;
  paymentDate: string | null;
}

export default function PaymentsPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [interval, setInterval] = useState(15); // 15 or 30 days
  const [periodStart, setPeriodStart] = useState<Date>(startOfMonth(new Date()));
  const [periodEnd, setPeriodEnd] = useState<Date>(addDays(startOfMonth(new Date()), 14));
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchFarmers();
    fetchDeliveries();
  }, []);

  useEffect(() => {
    // Update period end when interval or start changes
    setPeriodEnd(addDays(periodStart, interval - 1));
  }, [interval, periodStart]);

  useEffect(() => {
    // Fetch payments for the selected period
    const fetchPayments = async () => {
      const res = await fetch(`/api/payments?start=${format(periodStart, 'yyyy-MM-dd')}&end=${format(periodEnd, 'yyyy-MM-dd')}`);
      if (res.ok) setPayments(await res.json());
    };
    fetchPayments();
  }, [periodStart, periodEnd]);

  const fetchFarmers = async () => {
    const res = await fetch('/api/farmers');
    if (res.ok) setFarmers(await res.json());
  };
  const fetchDeliveries = async () => {
    const res = await fetch('/api/deliveries');
    if (res.ok) setDeliveries(await res.json());
    setLoading(false);
  };

  const paymentRows: PaymentRow[] = farmers.map(farmer => {
    const farmerDeliveries = deliveries.filter(d =>
      d.farmer.farmerId === farmer.farmerId &&
      isWithinInterval(new Date(d.date), { start: periodStart, end: periodEnd })
    );
    const totalLiters = farmerDeliveries.reduce((sum, d) => sum + d.quantity, 0);
    const totalAmount = totalLiters * (farmer.pricePerL || 0);
    // Find payment record for this farmer/period
    const payment = payments.find(p => p.farmerId === farmer.id && p.period >= format(periodStart, 'yyyy-MM-dd') && p.period <= format(periodEnd, 'yyyy-MM-dd'));
    return {
      farmer,
      totalLiters,
      totalAmount,
      status: payment ? payment.status : 'Pending',
      paymentDate: payment ? payment.paymentDate : null,
      paid: !!payment,
    };
  });

  const markAsPaid = async (row: any) => {
    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: row.farmer.id,
        period: format(periodStart, 'yyyy-MM-dd'),
        totalLiters: row.totalLiters,
        totalAmount: row.totalAmount,
        pricePerL: row.farmer.pricePerL,
      })
    });
    // Refresh payments
    const res = await fetch(`/api/payments?start=${format(periodStart, 'yyyy-MM-dd')}&end=${format(periodEnd, 'yyyy-MM-dd')}`);
    if (res.ok) setPayments(await res.json());
  };

  const exportToExcel = () => {
    const data = paymentRows.map(row => ({
      Farmer: `${row.farmer.name} (${row.farmer.farmerId})`,
      'Total Liters': row.totalLiters,
      'Price/Liter': row.farmer.pricePerL,
      'Total Amount': row.totalAmount,
      Status: row.paid ? 'Paid' : 'Pending',
      'Payment Date': row.paymentDate ? format(new Date(row.paymentDate), 'yyyy-MM-dd') : '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, `payments_${format(periodStart, 'yyyyMMdd')}_${format(periodEnd, 'yyyyMMdd')}.xlsx`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-600">View and manage farmer payments by period</p>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-medium">Interval:</label>
          <select
            value={interval}
            onChange={e => setInterval(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
          </select>
          <label className="font-medium ml-4">Period Start:</label>
          <input
            type="date"
            value={format(periodStart, 'yyyy-MM-dd')}
            onChange={e => setPeriodStart(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
          <span className="ml-2">to {format(periodEnd, 'MMM d, yyyy')}</span>
          <Button onClick={exportToExcel} variant="outline">Export to Excel</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payments for {format(periodStart, 'MMM d, yyyy')} - {format(periodEnd, 'MMM d, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Farmer</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Total Liters</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Price/Liter</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Total Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                ) : paymentRows.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">No farmers found.</td></tr>
                ) : (
                  paymentRows.map(row => (
                    <tr key={row.farmer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 whitespace-nowrap">{row.farmer.name} ({row.farmer.farmerId})</td>
                      <td className="px-4 py-2 whitespace-nowrap">{row.totalLiters}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{row.farmer.pricePerL} RWF</td>
                      <td className="px-4 py-2 whitespace-nowrap font-bold">{row.totalAmount.toLocaleString()} RWF</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {row.paid ? (
                          <Badge className="bg-green-100 text-green-800">Paid {row.paymentDate ? `on ${format(new Date(row.paymentDate), 'MMM d, yyyy')}` : ''}</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <Button size="sm" variant="outline" disabled={row.totalLiters === 0 || row.paid} onClick={() => markAsPaid(row)}>
                          Mark as Paid
                        </Button>
                      </td>
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