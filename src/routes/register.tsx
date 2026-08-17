import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { useShop } from "@/store/shop";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — NØVA" },
      { name: "description", content: "Join NØVA for early access to drops, saved fits and faster checkout." },
      { property: "og:title", content: "Create Account — NØVA" },
      { property: "og:description", content: "Join the NØVA member list." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { login } = useShop();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div className="hidden lg:block">
          <p className="label-xs text-primary">Membership</p>
          <h1 className="display mt-6 text-7xl leading-[0.9]">
            Join
            <br />
            The
            <br />
            Movement.
          </h1>
          <p className="editorial mt-8 max-w-md text-2xl text-muted-foreground">
            Members get first access to every drop, 48 hours before public release.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h2 className="display text-4xl lg:hidden">Create Account</h2>
          <form
            className="mt-8 space-y-5 lg:mt-0"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !email.includes("@") || password.length < 6) {
                toast.error("Fill every field with a valid email and 6+ character password.");
                return;
              }
              login(email, name.trim());
              void navigate({ to: "/account" });
            }}
          >
            <div>
              <label htmlFor="name" className="label-xs text-muted-foreground">
                Full Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="label-xs text-muted-foreground">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="label-xs text-muted-foreground">
                Password
              </label>
              <input
                id="reg-password"
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
              Create Account
            </button>
          </form>
          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}