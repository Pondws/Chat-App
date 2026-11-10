import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "components"

export const metadata: Metadata = { title: "Sign up" }

export default function RegisterPage() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">Already have an account?&nbsp;</span>
        <Link href="/login" className="font-medium underline-offset-4 hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </>
  )
}