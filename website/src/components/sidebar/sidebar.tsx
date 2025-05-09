'use client';

import Link from 'next/link';
import { Book, LogOut, Settings, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { signOut } from 'next-auth/react';
import BrandIcon from '@/public/brand.svg'
import Image from 'next/image';

export function CompSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-6 py-4">
          <Image src={BrandIcon} alt="Ion Recording Icon"/>
          <span className="text-lg font-bold" style={{color: '#592999'}}>Ion Recording</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="mb-[30%] mt-6 px-7">
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            Plans & Pricing
          </h3>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">Current Plan: Free</p>
            <Button variant="link" className="mt-2 p-0 text-primary">
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        </div>
        <SidebarMenu className="px-6">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/library">
                <Book className="mr-2 h-4 w-4" />
                <span>Library</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
