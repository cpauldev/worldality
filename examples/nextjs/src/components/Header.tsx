import Image from "next/image";

import { Nextjs } from "./icons/nextjs";

export function Header() {
  return (
    <header className="mb-12 flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/favicon.svg"
          alt=""
          className="size-11 shrink-0"
          aria-hidden="true"
          height={44}
          width={44}
        />
        <h1 className="text-foreground">Worldality</h1>
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div
            className="body-lg inline-flex min-h-10 min-w-40 items-center justify-center gap-2 px-4 whitespace-nowrap"
            style={{ backgroundColor: "#000000" }}
          >
            <Nextjs className="size-5 text-white" aria-hidden="true" />
            <p className="text-white">Next.js</p>
          </div>
        </div>
      </div>
    </header>
  );
}
