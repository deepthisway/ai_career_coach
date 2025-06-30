import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { ChevronDown, FileText, FileTextIcon, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem , DropdownMenuTrigger } from './ui/dropdown-menu';
import { checkUser } from '@/lib/checkUser';

const header = async () => {
  await checkUser(); // Ensure user is checked on header load
  // This will trigger the user check and create if not exists, mostlt works when
  // loggin in using google and other OAuth providers
  // This is important to ensure that the user is created in our database
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={250}
            height={250}
            className="border-1 border-white rounded-2xl"
          />
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/interview" className="flex items-center gap-2">
                    <PenBox className="h-4 w-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">
                <FileText className="h-4 w-4" />
                <span className="hidden md:block">Sign In</span>
              </Button>
            </SignInButton>
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonAvatarBox: "h-8 w-8",
                  userButtonAvatar: "h-8 w-8 rounded-full",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default header