import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { type EntryContext, ServerRouter } from "react-router";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;

    const { abort, pipe } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;

          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(body as unknown as BodyInit, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;

          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
