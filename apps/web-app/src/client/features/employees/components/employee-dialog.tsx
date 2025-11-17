"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Search } from "lucide-react";
import { useTrpc } from "@/client/lib/trpc";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/client/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/components/ui/form";
import { Input } from "@/client/components/ui/input";
import { Button } from "@/client/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { BusinessRole } from "@/server/core/domain/entities";
import { useDebounce } from "@/client/hooks/use-debounce";

const formSchema = z.object({
  userId: z.string().min(1, "User is required"),
  role: z.enum(BusinessRole),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  editData?: {
    id: string;
    userId: string;
    role: BusinessRole;
    firstName: string;
    lastName: string;
  };
}

export function EmployeeDialog({
  open,
  onOpenChange,
  onSubmit,
  editData,
}: EmployeeDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: editData?.userId || "",
      role: editData?.role || BusinessRole.EMPLOYEE,
    },
  });

  const { data: searchData, isLoading: searching } =
    useTrpc.user.search.useQuery(
      { search: debouncedSearch },
      { enabled: !editData && debouncedSearch.length >= 2 }
    );
  const searchResults = searchData?.users;

  useEffect(() => {
    if (editData) {
      form.reset({
        userId: editData.userId,
        role: editData.role,
      });
    }
  }, [editData, form]);

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save employee:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl">
            {editData ? "Edit Employee" : "Add Employee"}
          </SheetTitle>
          <SheetDescription>
            {editData
              ? "Update the employee role"
              : "Search for a user by email or name and assign them a role"}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {!editData && (
                <div className="space-y-2">
                  <FormLabel>Search User</FormLabel>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                    {searching && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {searchResults && searchResults.length > 0 && (
                    <div className="border rounded-md max-h-[200px] overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            form.setValue("userId", user.id);
                            setSearchTerm(
                              `${user.firstName} ${user.lastName} (${user.email})`
                            );
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.pictureFullPath || undefined}
                            />
                            <AvatarFallback>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {editData && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Editing role for:
                  </p>
                  <p className="text-sm font-medium">
                    {editData.firstName} {editData.lastName}
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BusinessRole.EMPLOYEE}>
                          Employee
                        </SelectItem>
                        <SelectItem value={BusinessRole.MANAGER}>
                          Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 px-6 py-4 border-t bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSearchTerm("");
                  onOpenChange(false);
                }}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.watch("userId")}
                className="flex-1"
              >
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editData ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
