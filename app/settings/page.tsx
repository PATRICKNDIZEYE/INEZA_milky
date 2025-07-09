"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import { CreditCard, MessageCircle, Mail } from 'lucide-react';

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const [stripeOpen, setStripeOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch current user info on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me', { headers: { 'x-user-id': 'self' } })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle profile save
  const handleProfileSave = async () => {
    setSaving(true);
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-id': 'self' },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      toast.success('Profile updated!');
    } else {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12">
      <h1 className="text-4xl font-extrabold mb-4">Settings</h1>
      <p className="text-lg text-gray-600 mb-10">Manage your account, organization, and preferences</p>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-10 text-lg gap-4 px-2 py-3 rounded-xl bg-gray-100">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-8 rounded-2xl shadow-lg">
            <CardHeader><CardTitle className="text-2xl">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-10">
              <div className="flex items-center gap-10">
                <Avatar className="w-28 h-28" />
                <div>
                  <Button size="lg" variant="outline">Change Photo</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-semibold mb-2 text-lg">Name</label>
                  <Input className="h-14 text-lg" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Your Name" disabled={loading} />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Email</label>
                  <Input className="h-14 text-lg" name="email" type="email" value={profile.email} onChange={handleProfileChange} placeholder="you@email.com" disabled={loading} />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Phone</label>
                  <Input className="h-14 text-lg" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Phone number" disabled={loading} />
                </div>
              </div>
              <div>
                <Button size="lg" onClick={handleProfileSave} disabled={saving || loading}>{saving ? 'Saving...' : 'Save Profile'}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Organization Tab */}
        <TabsContent value="organization">
          <Card className="p-8 rounded-2xl shadow-lg">
            <CardHeader><CardTitle className="text-2xl">Organization</CardTitle></CardHeader>
            <CardContent className="space-y-10">
              <div className="flex items-center gap-10">
                <Avatar className="w-28 h-28" />
                <div>
                  <Button size="lg" variant="outline">Change Logo</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-semibold mb-2 text-lg">Organization Name</label>
                  <Input className="h-14 text-lg" placeholder="Rwanda Dairy" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Contact Email</label>
                  <Input className="h-14 text-lg" type="email" placeholder="info@company.com" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Phone</label>
                  <Input className="h-14 text-lg" placeholder="+250..." />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Default Collection Center</label>
                  <Input className="h-14 text-lg" placeholder="Main Center" />
                </div>
              </div>
              <div>
                <Button size="lg">Save Organization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="p-8 rounded-2xl shadow-lg">
            <CardHeader><CardTitle className="text-2xl">Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-10">
              <div className="flex items-center justify-between text-lg">
                <span>Dark Mode</span>
                <Switch className="scale-125" />
              </div>
              <div className="flex items-center justify-between text-lg">
                <span>Email Notifications</span>
                <Switch className="scale-125" />
              </div>
              <div className="flex items-center justify-between text-lg">
                <span>SMS Notifications</span>
                <Switch className="scale-125" />
              </div>
              <div>
                <Button size="lg">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="p-8 rounded-2xl shadow-lg">
            <CardHeader><CardTitle className="text-2xl">Security</CardTitle></CardHeader>
            <CardContent className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-semibold mb-2 text-lg">Current Password</label>
                  <Input className="h-14 text-lg" type="password" placeholder="Current password" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">New Password</label>
                  <Input className="h-14 text-lg" type="password" placeholder="New password" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Confirm New Password</label>
                  <Input className="h-14 text-lg" type="password" placeholder="Confirm new password" />
                </div>
              </div>
              <div>
                <Button size="lg">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader><CardTitle className="text-2xl">Integrations</CardTitle></CardHeader>
            <CardContent className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Stripe Payments */}
                <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-12 shadow-md min-h-[260px]">
                  <CreditCard className="w-14 h-14 text-blue-500 mb-6" />
                  <div className="font-semibold text-xl mb-3">Stripe Payments</div>
                  <div className="text-gray-500 text-base mb-6 text-center">Connect and manage your Stripe payment integration.</div>
                  <Button size="lg" className="text-lg px-8 py-4" onClick={() => setStripeOpen(true)}>Configure</Button>
                </div>
                {/* SMS Provider */}
                <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-12 shadow-md min-h-[260px]">
                  <MessageCircle className="w-14 h-14 text-green-500 mb-6" />
                  <div className="font-semibold text-xl mb-3">SMS Provider</div>
                  <div className="text-gray-500 text-base mb-6 text-center">Set up SMS notifications for your users.</div>
                  <Button size="lg" className="text-lg px-8 py-4" onClick={() => setSmsOpen(true)}>Configure</Button>
                </div>
                {/* Email Provider */}
                <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-12 shadow-md min-h-[260px]">
                  <Mail className="w-14 h-14 text-purple-500 mb-6" />
                  <div className="font-semibold text-xl mb-3">Email Provider</div>
                  <div className="text-gray-500 text-base mb-6 text-center">Configure your email sending service.</div>
                  <Button size="lg" className="text-lg px-8 py-4" onClick={() => setEmailOpen(true)}>Configure</Button>
                </div>
              </div>
              {/* Modals for each integration */}
              {stripeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-xl p-12 w-full max-w-xl shadow-xl relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl" onClick={() => setStripeOpen(false)}>&times;</button>
                    <h2 className="text-2xl font-bold mb-6">Configure Stripe Payments</h2>
                    <div className="mb-8 text-gray-600 text-lg">(Integration form goes here)</div>
                    <Button size="lg" onClick={() => setStripeOpen(false)}>Save</Button>
                  </div>
                </div>
              )}
              {smsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-xl p-12 w-full max-w-xl shadow-xl relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl" onClick={() => setSmsOpen(false)}>&times;</button>
                    <h2 className="text-2xl font-bold mb-6">Configure SMS Provider</h2>
                    <div className="mb-8 text-gray-600 text-lg">(Integration form goes here)</div>
                    <Button size="lg" onClick={() => setSmsOpen(false)}>Save</Button>
                  </div>
                </div>
              )}
              {emailOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-xl p-12 w-full max-w-xl shadow-xl relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl" onClick={() => setEmailOpen(false)}>&times;</button>
                    <h2 className="text-2xl font-bold mb-6">Configure Email Provider</h2>
                    <div className="mb-8 text-gray-600 text-lg">(Integration form goes here)</div>
                    <Button size="lg" onClick={() => setEmailOpen(false)}>Save</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 