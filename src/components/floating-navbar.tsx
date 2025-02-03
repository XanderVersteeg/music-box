"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import React, { JSX, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LogOut, Settings, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { placeholders } from "@/data";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { AccessToken, Search, Artist, Album } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/app/api/users/getUser/route";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
  const [showResults, setShowResults] = useState(false);

  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  const cachedToken: AccessToken | null = null;
  const tokenExpiry: number | null = null;

  const getCurrentTimestamp = (): number => Math.floor(Date.now() / 1000);

  const navRef = useRef<HTMLDivElement>(null);

  // getUser useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["getUser", session?.user?.email],
    queryFn: async (): Promise<Array<UserType>> => {
      const response = await fetch(
        `/api/users/getUser?email=${session?.user?.email}`
      );

      return response.json();
    },
  });

  // spotifyToken useQuery
  const { data: tokenResponse } = useQuery({
    queryKey: ["spotifyToken"],
    queryFn: async (): Promise<AccessToken> => {
      if (cachedToken && tokenExpiry && getCurrentTimestamp() < tokenExpiry) {
        return cachedToken;
      }

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      });
      return response.json();
    },
  });

  // searchArtist useQuery
  const { data: searchArtist } = useQuery({
    queryKey: ["searchArtists", searchInput],
    queryFn: async (): Promise<Search> => {
      if (tokenResponse?.access_token) {
        const response = await fetch(
          "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
          {
            method: "GET",
            headers: { Authorization: "Bearer " + tokenResponse.access_token },
          }
        );

        return response.json();
      }

      return {
        artists: {
          items: [],
          href: "",
          limit: 0,
          next: "",
          offset: 0,
          previous: "",
          total: 0,
        },
      };
    },
  });

  // searchAlbum useQuery
  const { data: searchAlbum } = useQuery({
    queryKey: ["searchAlbums", searchInput],
    queryFn: async (): Promise<Search | undefined> => {
      if (tokenResponse?.access_token) {
        const response = await fetch(
          "https://api.spotify.com/v1/search?q=" + searchInput + "&type=album",
          {
            method: "GET",
            headers: { Authorization: "Bearer " + tokenResponse.access_token },
          }
        );

        return response.json();
      }
      return {
        artists: {
          items: [],
          href: "",
          limit: 0,
          next: "",
          offset: 0,
          previous: "",
          total: 0,
        },
      };
    },
  });

  const { data: searchUser } = useQuery({
    queryKey: ["searchUser", searchInput],
    queryFn: async (): Promise<Array<UserType>> => {
      const response = await fetch(
        `/api/users/searchUser?username=${searchInput}`
      );

      return response.json();
    },
  });

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

  const pathname = usePathname();

  useEffect(() => {
    setShowResults(false);
  }, [pathname]);

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
          {/* Items */}
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

          {/* SearchBar */}
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

          {/* Auth */}
          <button className=" hover:cursor-pointer border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
            {!isLoading && data && data[0] ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    {data[0]?.username ? (
                      <span>{data[0].username}</span>
                    ) : (
                      <span>Profile</span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <Link href={`/${data && data[0]?.username}`}>
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

        {/* Results */}
        {showResults &&
          searchAlbum?.albums?.items?.length &&
          searchArtist?.artists?.items?.length && (
            <div className="mt-4 w-full flex flex-col items-center">
              <div className="w-full max-w-md md:w-104">
                {searchUser && renderSearchResults(searchUser)}
                {renderSearchResults(searchArtist.artists.items, "artist")}
                {renderSearchResults(searchAlbum.albums.items, "album")}
              </div>
            </div>
          )}
      </motion.div>
    </AnimatePresence>
  );
};

const renderSearchResults = (
  items: (Artist | Album | UserType)[],
  type?: string
) =>
  items.slice(0, 2).map((item, index) => {
    const isUser = !type;
    const imageUrl =
      !isUser && (item as Album | Artist).images?.[0]?.url
        ? (item as Album | Artist).images[0].url
        : (item as UserType).image ||
          "https://i.scdn.co/image/ab67616d0000b273cad190f1a73c024e5a40dddd";

    const displayName = isUser
      ? (item as UserType).username
      : (item as Artist | Album).name || "Unknown";

    const href = `/${type || "user"}/${
      isUser ? (item as UserType).username : item.id
    }`;

    return (
      <Link
        href={href}
        key={`${type || "user"}-${index}`}
        className="py-4 px-2 overflow-hidden dark:hover:bg-neutral-800 rounded-md flex items-center space-x-6 mb-4"
      >
        <Image
          src={imageUrl}
          alt={displayName || "Unknown"}
          className="rounded-md"
          width={80}
          height={80}
        />
        <span className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
          {displayName}
        </span>
      </Link>
    );
  });
