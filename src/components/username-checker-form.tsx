"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { usernameRegex } from "@/data";
import { Input } from "./ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { AlertDialogFooter } from "./ui/alert-dialog";
import { Button } from "./ui/button";

export function UsernameCheckerForm(user: {
  user: {
    username: string | null;
    name: string | null;
    image: string | null;
    id: string;
    email: string | null;
    emailVerified: Date | null;
  };
}) {
  const [username, setUsername] = useState<string>("");
  const [data, setData] = useState<{ success: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/checkUsername", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log("API Response:", data);

        setData(data);
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [username]);

  const formSchema = z
    .object({
      username: z
        .string()
        .min(2, {
          message: "Username must be at least 2 characters.",
        })
        .max(32, {
          message: "Username must be at most 32 characters.",
        })
        .regex(usernameRegex, {
          message: "Username may only contain letters and numbers.",
        }),
    })
    .refine(() => !isLoading && data?.success == true, {
      message: "Username already taken",
      path: ["username"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/updateUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: user.user.email,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      router.push(`/${values.username}`);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative grid grid-cols-4 items-center gap-4">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative col-span-3">
                  <Input
                    placeholder="John Doe"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    {username && (
                      <HoverCard>
                        <HoverCardTrigger>
                          {username.length < 2 ||
                          username.length > 32 ||
                          !username.match(usernameRegex) ||
                          (data?.success !== true && username.length > 0) ? (
                            <X />
                          ) : (
                            <Check />
                          )}
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-fit p-2 text-xs"
                          side="top"
                        >
                          <div>
                            {username.length < 2
                              ? "Username must be at least 2 characters"
                              : username.length > 32
                              ? "Username must be at most 32 characters"
                              : !username.match(usernameRegex)
                              ? "Username may only contain letters and numbers"
                              : data?.success !== true
                              ? "Username already taken"
                              : "Username available"}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="col-span-4 text-center" />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button type="submit" className="hover:cursor-pointer">
            Select username
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
