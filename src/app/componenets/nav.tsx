"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarMenuToggle,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Avatar,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { FaChevronDown, FaHome } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { type User } from "@supabase/supabase-js";

export function Nav() {
  const path = usePathname().split("/").slice(1);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="mb-4 w-screen">
      <Navbar
        isBordered
        classNames={{
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-primary",
          ],
        }}
        className="max-w-full hidden md:flex"
      >
        <NavbarBrand>
          <Link color="foreground" href="/">
            <Button
              variant={path[0] === "" ? "ghost" : "faded"}
              isIconOnly
              color="default"
              aria-label="home"
            >
              <FaHome />
            </Button>
          </Link>
        </NavbarBrand>

        <Dropdown>
          <NavbarItem isActive={path.includes("about")}>
            <DropdownTrigger>
              <Button
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={<FaChevronDown fill="currentColor" size={16} />}
                radius="sm"
                variant="light"
              >
                About
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="About"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem href="/about/mission" key="mission">
              Our Mission
            </DropdownItem>
            <DropdownItem href="/about/rates" key="rates">
              Rates
            </DropdownItem>
            <DropdownItem href="/about/faq" key="faq">
              FAQs
            </DropdownItem>
            <DropdownItem href="/about/why" key="why">
              Why Us?
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive={path.includes("tutors")}>
            <Link aria-current="page" color="foreground" href="/tutors">
              Tutors
            </Link>
          </NavbarItem>

          <NavbarItem isActive={path.includes("book") || path.includes("deck")}>
            <Link href="/book" color="foreground" aria-current="page">
              Appointments
            </Link>
          </NavbarItem>
        </NavbarContent>

        {!user && (
          <NavbarContent justify="end">
            <NavbarItem>
              <Button as={Link} color="primary" href="/login" variant="flat">
                Sign Up/Login
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
        {user && (
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  aria-label="Avatar"
                  className="transition-transform"
                  color="primary"
                  size="sm"
                  src={
                    "https://wvnpa.org/content/uploads/blank-profile-picture-973460_1280-768x768.png"
                  }
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user.email}</p>
                </DropdownItem>
                <DropdownItem key="settings" href="/account">
                  My Profile
                </DropdownItem>
                <DropdownItem key="help_and_feedback" href="/about/faq">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger" as="div">
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="w-full text-left">
                      Log Out
                    </button>
                  </form>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        )}
      </Navbar>
    </div>
  );
}
