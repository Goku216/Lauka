"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { User } from 'lucide-react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { toast } from 'sonner';
import NotificationSection from '@/components/Admin/settings/NotificationSection';
import ChangePasswordSection from '@/components/Admin/settings/ChangePasswordSection';

export default function Settings() {

  
  const [profileData, setProfileData] = useState({
    name:  '',
    email: '',
  });



  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your profile has been updated successfully.')
  };


  return (
    <AdminLayout>
    <div className="md:flex md:flex-col md:w-[50%] space-y-6 animate-fade-in">
      <div className=''>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
 
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Settings */}
    <ChangePasswordSection />

      {/* Notification Preferences */}
      {/* <NotificationSection /> */}
      </div>

    </AdminLayout>
  );
}
