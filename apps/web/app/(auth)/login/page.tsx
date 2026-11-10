import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "components"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue chatting</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account?&nbsp;</span>
        <Link href="/register" className="font-medium underline-offset-4 hover:underline">
          Sign up
        </Link>
      </CardFooter>
    </>
  )
}