"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QueryClientProvider } from "./provider";
import { UserType } from "@/app/api/users/getUser/route";
import { usernameRegex } from "@/data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";

export function UsernameChecker() {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const [username, setUsername] = useState<string>("");

  // useQuery: getUser
  const { data: user } = useQuery({
    queryKey: ["getUser", session?.user?.email],
    queryFn: async (): Promise<Array<UserType>> => {
      const response = await fetch(
        `/api/users/getUser?email=${session?.user?.email}`
      );

      return response.json();
    },
  });

  // useQuery: checkUsername
  const { data, isLoading } = useQuery({
    queryKey: ["checkUsername", username],
    queryFn: async () => {
      const response = await fetch("/api/users/checkUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      return response.json();
    },
  });

  // useMutation: updateUsername
  const { mutateAsync: updateUsername, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/users/updateUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email: user?.[0]?.email,
        }),
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  // Form validation
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

  const handleSubmit = async () => {
    try {
      await updateUsername();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  if (!session) return null;

  if (user && user[0] && !user[0].username) {
    return (
      <div className="text-2xl">
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Choose username</AlertDialogTitle>
              <AlertDialogDescription>
                <span>
                  Please pick a username to gain full access to MusicBox.
                </span>
                <br />
                <span>Your username can be updated later.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <QueryClientProvider>
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
                              {username && !isLoading && (
                                <HoverCard>
                                  <HoverCardTrigger>
                                    {username.length < 2 ||
                                    username.length > 32 ||
                                    !username.match(usernameRegex) ||
                                    (data?.success !== true &&
                                      username.length > 0) ? (
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
                    <Button
                      type="submit"
                      className="hover:cursor-pointer"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span>Loading</span>
                      ) : (
                        <span>Select username</span>
                      )}
                    </Button>
                  </AlertDialogFooter>
                </form>
              </Form>
            </QueryClientProvider>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
}
