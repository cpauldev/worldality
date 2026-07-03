import { ReactRouter } from "./icons/react-router";

export function Header() {
  return (
    <header className="mb-12 flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/favicon.svg"
          alt=""
          className="size-11 shrink-0"
          aria-hidden="true"
        />
        <h1 className="text-foreground">Worldality</h1>
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div
            className="body-lg inline-flex min-h-10 min-w-40 items-center justify-center gap-2 px-4 whitespace-nowrap"
            style={{ backgroundColor: "#d83933", color: "#ffffff" }}
          >
            <ReactRouter className="size-5" aria-hidden="true" />
            <p>React Router</p>
          </div>
        </div>
      </div>
    </header>
  );
}
