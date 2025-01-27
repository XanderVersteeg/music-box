import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components//ui/form";
import { UsernameCheckerForm } from "./username-checker-form";

export async function UsernameChecker() {
  const session = await auth();

  const data =
    session.user.email &&
    (await db.select().from(users).where(eq(users.email, session.user.email)));
  const user = data[0];

  if (!user.username) {
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
            <UsernameCheckerForm user={user} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
}
