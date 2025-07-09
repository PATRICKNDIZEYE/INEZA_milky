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
  const [org, setOrg] = useState({ name: '', contactEmail: '' });
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgSaving, setOrgSaving] = useState(false);

  // Fetch current user info on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch organization info on mount
  useEffect(() => {
    setOrgLoading(true);
    fetch('/api/organization')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setOrg({ name: data.name || '', contactEmail: data.contactEmail || '' });
      })
      .finally(() => setOrgLoading(false));
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
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      toast.success('Profile updated!');
    } else {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  // Handle org form change
  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrg({ ...org, [e.target.name]: e.target.value });
  };

  // Handle org save
  const handleOrgSave = async () => {
    setOrgSaving(true);
    const res = await fetch('/api/organization', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(org),
    });
    if (res.ok) {
      toast.success('Organization updated!');
    } else {
      toast.error('Failed to update organization');
    }
    setOrgSaving(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-3">
      <h1 className="text-4xl font-extrabold mb-4">Settings</h1>
      <p className="text-lg text-gray-600 mb-10">Manage your account, organization, and preferences</p>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-10 text-lg gap-4 px-2 py-3 rounded-xl bg-gray-100">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="organization">Organization</TabsTrigger> */}
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-8 rounded-2xl shadow-lg">
            <CardHeader><CardTitle className="text-2xl">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-10">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-semibold mb-2 text-lg">Organization Name</label>
                  <Input className="h-14 text-lg" name="name" value={org.name} onChange={handleOrgChange} placeholder="Rwanda Dairy" disabled={orgLoading} />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-lg">Contact Email</label>
                  <Input className="h-14 text-lg" name="contactEmail" type="email" value={org.contactEmail} onChange={handleOrgChange} placeholder="info@company.com" disabled={orgLoading} />
                </div>
              </div>
              <div>
                <Button size="lg" onClick={handleOrgSave} disabled={orgSaving || orgLoading}>{orgSaving ? 'Saving...' : 'Save Organization'}</Button>
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
      </Tabs>
    </div>
  );
} 