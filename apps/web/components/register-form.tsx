"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi, meQueryKey } from "apis";
import { registerSchema, type RegisterInput } from "../schemas";

const fields = [
  { name: "name", label: "Name", type: "text", placeholder: "Jane Doe", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
] as const;

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(meQueryKey, data);
      toast.success("Account created!");
      router.replace(redirectTo ?? "/chat");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <form id="register-form" onSubmit={form.handleSubmit((v) => register.mutate(v))} noValidate>
      <FieldGroup className="gap-5">
        {fields.map(({ name, label, ...inputProps }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`register-${name}`}>{label}</FieldLabel>
                <Input {...field} {...inputProps} id={`register-${name}`} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
        <Button type="submit" form="register-form" className="w-full" disabled={register.isPending}>
          {register.isPending && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </FieldGroup>
    </form>
  );
}