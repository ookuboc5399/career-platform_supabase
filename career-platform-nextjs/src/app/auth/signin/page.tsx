"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Provider {
  id: string;
  name: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const loadProviders = async () => {
      const res = await fetch('/api/auth/providers');
      const data = await res.json();
      setProviders(Object.values(data));
    };
    loadProviders();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ログイン
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {providers.map((provider) => (
            <div key={provider.name} className="text-center">
              <button
                onClick={() => signIn(provider.id, { callbackUrl })}
                className="group relative flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {provider.name}でログイン
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
