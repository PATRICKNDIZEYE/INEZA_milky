"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

export default function SmsTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('0783787463');
  const [testType, setTestType] = useState('delivery');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestSms = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, testType })
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success('SMS sent successfully!');
      } else {
        toast.error(data.error || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS test failed:', error);
      toast.error('Failed to send SMS');
    } finally {
      setLoading(false);
    }
  };

  const getSampleMessage = () => {
    if (testType === 'delivery') {
      return 'Murakoze Test Farmer! Amata yawe ya 25L yashyizwemo mu gahuzu ku wa 15/12/2024. Murakoze kwishyura!';
    }
    return 'Murakoze! Iyi ni SMS yo kugenzura. Thank you for testing!';
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SMS Test</h1>
        <p className="text-gray-600">Test SMS functionality with FDI SMS API</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Send Test SMS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., 0783787463"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a valid Rwanda phone number (can start with 07 or 7).
            </p>
          </div>

          <div>
            <Label htmlFor="testType">Test Type</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Milk Delivery Notification</SelectItem>
                <SelectItem value="simple">Simple Test Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sample Message</Label>
            <div className="p-3 bg-gray-50 rounded text-sm">
              {getSampleMessage()}
            </div>
          </div>

          <Button 
            onClick={handleTestSms} 
            disabled={loading || !phoneNumber}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Test SMS'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><code className="bg-gray-100 px-2 py-1 rounded">FDI_SMS_USERNAME</code> - Your FDI SMS API username</div>
            <div><code className="bg-gray-100 px-2 py-1 rounded">FDI_SMS_PASSWORD</code> - Your FDI SMS API password</div>
            <div><code className="bg-gray-100 px-2 py-1 rounded">FDI_SMS_SENDER_ID</code> - Your approved sender ID</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 