import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { useShop } from "@/store/shop";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — NØVA" },
      { name: "description", content: "Sign in to your NØVA account to track orders and saved pieces." },
      { property: "og:title", content: "Sign In — NØVA" },
      { property: "og:description", content: "Access your NØVA account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useShop();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div className="hidden lg:block">
          <p className="label-xs text-primary">Members</p>
          <h1 className="display mt-6 text-7xl leading-[0.9]">
            Welcome
            <br />
            Back to
            <br />
            The Era.
          </h1>
          <p className="editorial mt-8 max-w-md text-2xl text-muted-foreground">
            Early access to drops, saved fits, and order tracking — all in one place.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h2 className="display text-4xl lg:hidden">Sign In</h2>
          <form
            className="mt-8 space-y-5 lg:mt-0"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@") || password.length < 6) {
                toast.error("Enter a valid email and a 6+ character password.");
                return;
              }
              login(email);
              void navigate({ to: "/account" });
            }}
          >
            <div>
              <label htmlFor="email" className="label-xs text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-xs text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="label-xs w-full bg-primary py-4 text-primary-foreground transition-opacity hover:opacity-85"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}