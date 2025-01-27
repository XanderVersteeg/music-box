/* eslint-disable @next/next/no-img-element */
"use client";
import React, { JSX, useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LogOut, Settings, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { placeholders } from "@/data";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  spotifyGetToken,
  spotifySearchAlbums,
  spotifySearchArtists,
} from "@/server/spotify";
import { Search } from "@/types";
import { UserType } from "@/app/api/users/getUser/route";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { data: session } = useSession();
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchOutput, setSearchOutput] = useState<Search>();
  const [showResults, setShowResults] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/users/getUser?email=${session?.user?.email}`
      );
      const data = await response.json();
      setUser(data[0]);
    };

    fetchData();
  }, [session?.user?.email]);

  useEffect(() => {
    void (async () => {
      const tokenResponse = await spotifyGetToken();
      if (tokenResponse.access_token) {
        const artistResponse = await spotifySearchArtists(
          tokenResponse.access_token,
          searchInput
        );
        const albumResponse = await spotifySearchAlbums(
          tokenResponse.access_token,
          searchInput
        );
        const combinedResponse: Search = {
          artists: artistResponse.artists,
          albums: albumResponse.albums,
        };
        setSearchOutput(combinedResponse);
      }
    })();
  }, [searchInput]);

  useEffect(() => {
    const checkScrollable = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setIsScrollable(scrollableHeight > 0);
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  useEffect(() => {
    setVisible(true);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (!isScrollable) return;

    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      const isAtTop = current <= 0.01;

      if (isAtTop || direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
        setHasInteracted(true);
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowResults(true);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchInput("");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={navRef}
        initial={{
          opacity: hasInteracted ? 0 : 1,
          y: hasInteracted ? -100 : 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex flex-col max-w-fit fixed top-6 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] bg-white dark:bg-black shadow-md z-5000 px-6 py-4 items-center space-x-4",
          "rounded-3xl",
          className
        )}
      >
        <div className="flex items-center space-x-4">
          {navItems.map(
            (
              navItem: { name: string; link: string; icon?: JSX.Element },
              idx: number
            ) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block text-sm">{navItem.name}</span>
              </Link>
            )
          )}

          <div
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>

          <button className=" hover:cursor-pointer border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="">
                    {user?.name ? (
                      <span>{user.name}</span>
                    ) : (
                      <span>Profile</span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                  <DropdownMenuGroup>
                    <Link href={`${user?.username}`}>
                      <DropdownMenuItem className="hover:cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="hover:cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => {
                      void signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span onClick={() => signIn("google")}>Sign in</span>
            )}
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        </div>

        {showResults &&
          searchOutput?.albums?.items?.length &&
          searchOutput.artists?.items.length &&
          searchOutput?.albums?.items?.length > 0 &&
          searchOutput.artists?.items.length > 0 && (
            <div className="mt-4 w-full flex flex-col items-center pr-3">
              {/* Render Top 2 Artists */}
              <div className="w-full max-w-md" style={{ width: "26rem" }}>
                {renderSearchResults(searchOutput?.artists?.items, true)}
              </div>

              {/* Render Top 2 Albums */}
              <div className="w-full max-w-md" style={{ width: "26rem" }}>
                {renderSearchResults(searchOutput?.albums?.items, false)}
              </div>
            </div>
          )}
      </motion.div>
    </AnimatePresence>
  );
};

const renderSearchResults = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[],
  isArtist: boolean
) => {
  return items.slice(0, 2).map((item, index) => (
    <Link
      href={`${isArtist ? "artist" : "album"}/${item.id}`}
      key={`${isArtist ? "artist" : "album"}-${index}`}
      className="py-4 px-2 dark:hover:bg-neutral-800 rounded-md flex items-center space-x-6 mb-4"
    >
      <img
        src={item.images?.[0]?.url || "/placeholder.jpg"}
        alt={item.name}
        className="w-20 h-auto rounded-md"
      />
      <span className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
        {item.name}
      </span>
    </Link>
  ));
};

// TODO: fix scrollbar
