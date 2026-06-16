import {
  CAPABILITY_CTA_CLASS_NAME,
  CAPABILITY_FOOTER_CLASS_NAME,
  CAPABILITY_ICON_FRAME_CLASS_NAME,
  CAPABILITY_IMAGE_CLASS_NAME,
  CAPABILITY_IMAGE_WRAPPER_CLASS_NAME,
  CAPABILITY_OVERLAY_CLASS_NAME,
  CAPABILITY_TILE_CLASS_NAME,
  CARD_ELEVATION_SHADOW_CLASS_NAME,
  CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
  studioPreviewImage,
  widgetPreviewImage,
} from "example-shared/capability-cards";
import { useTheme } from "example-shared/solid/useTheme";
import { useWorldalityWidget } from "example-shared/solid/useWorldalityWidget";
import {
  fetchStudioStatus,
  getInitialStudioStatus,
  getStudioStatusClassName,
} from "example-shared/studio";
import { cn } from "example-shared/ui";
import {
  ArrowUpRight,
  Globe,
  LoaderCircle,
  Monitor,
  Puzzle,
} from "lucide-solid";
import {
  type JSX,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { t, useCurrentLocale } from "worldality/solid";

const WORLDALITY_STUDIO_LABEL = "Worldality Studio";
const WORLDALITY_WIDGET_LABEL = "Worldality Widget";

function translateStudioStatusLabel(label: string): string {
  switch (label) {
    case "Checking...":
      return t("Checking...");
    case "Connected":
      return t("Connected");
    case "Starting...":
      return t("Starting...");
    case "Error":
      return t("Error");
    case "Ready to launch":
      return t("Ready to launch");
    case "Unavailable":
      return t("Unavailable");
    default:
      return label;
  }
}

type CapabilityTileProps = {
  ariaLabel: string;
  buttonRef?: (node: HTMLButtonElement) => void;
  children: JSX.Element;
  footer?: JSX.Element;
  href?: string;
  icon: typeof Monitor;
  iconClassName: string;
  image: string;
  rel?: string;
  target?: string;
  title: string;
};

function CapabilityTile(props: CapabilityTileProps) {
  const className = cn(
    CAPABILITY_TILE_CLASS_NAME,
    CARD_ELEVATION_SHADOW_CLASS_NAME,
    CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
  );
  const Icon = props.icon;
  const content = (
    <>
      <div aria-hidden="true" class={CAPABILITY_IMAGE_WRAPPER_CLASS_NAME}>
        <img src={props.image} alt="" class={CAPABILITY_IMAGE_CLASS_NAME} />
      </div>
      <div aria-hidden="true" class={CAPABILITY_OVERLAY_CLASS_NAME} />
      <div class="relative z-10 flex w-full flex-col items-center justify-center gap-4">
        <div class={CAPABILITY_ICON_FRAME_CLASS_NAME}>
          <Icon aria-hidden="true" class={props.iconClassName} />
        </div>
        <h4 class="text-white">{props.title}</h4>
        <div class={CAPABILITY_CTA_CLASS_NAME}>{props.children}</div>
      </div>
      {props.footer ? (
        <div class={CAPABILITY_FOOTER_CLASS_NAME}>{props.footer}</div>
      ) : null}
    </>
  );

  if (props.href) {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        class={className}
        aria-label={props.ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={props.buttonRef}
      type="button"
      class={className}
      aria-label={props.ariaLabel}
    >
      {content}
    </button>
  );
}

export function Home() {
  const { theme } = useTheme();
  const { setButtonRef } = useWorldalityWidget(theme);
  const locale = useCurrentLocale();
  const [studioStatus, setStudioStatus] = createSignal(
    getInitialStudioStatus(),
  );
  const studioStatusLabel = createMemo(() => {
    locale();
    return translateStudioStatusLabel(studioStatus().label);
  });

  onMount(() => {
    let isMounted = true;

    const syncStudioStatus = async () => {
      const nextStatus = await fetchStudioStatus();
      if (isMounted) {
        setStudioStatus(nextStatus);
      }
    };

    void syncStudioStatus();
    const intervalId = window.setInterval(() => {
      void syncStudioStatus();
    }, 5000);

    onCleanup(() => {
      isMounted = false;
      window.clearInterval(intervalId);
    });
  });

  return (
    <div class="grid gap-6 sm:grid-cols-2">
      <CapabilityTile
        ariaLabel={
          locale() &&
          t("Open {studio}", {
            studio: WORLDALITY_STUDIO_LABEL,
          })
        }
        href="/worldality"
        target="_blank"
        rel="noreferrer"
        icon={Monitor}
        iconClassName="text-blue-500"
        image={studioPreviewImage}
        title={WORLDALITY_STUDIO_LABEL}
        footer={
          <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center body-sm">
            <span
              class={cn(
                "font-medium",
                getStudioStatusClassName(studioStatus().tone),
              )}
            >
              {studioStatus().isLoading ? (
                <LoaderCircle
                  class="me-1 inline size-3.5 animate-spin align-[-2px]"
                  aria-hidden="true"
                />
              ) : null}
              {studioStatusLabel()}
            </span>
            {studioStatus().urlLabel ? (
              <>
                <span class="text-white/48" aria-hidden="true">
                  /
                </span>
                <bdi class="text-white/72" dir="ltr">
                  {studioStatus().urlLabel}
                </bdi>
              </>
            ) : null}
          </div>
        }
      >
        {locale() && t("Open {studio}", { studio: "Studio" })}
        <ArrowUpRight
          class={cn("size-6", locale().direction === "rtl" && "-scale-x-100")}
          aria-hidden="true"
        />
      </CapabilityTile>

      <CapabilityTile
        ariaLabel={locale() && t("Change language")}
        buttonRef={setButtonRef}
        icon={Puzzle}
        iconClassName="text-pink-500"
        image={widgetPreviewImage}
        title={WORLDALITY_WIDGET_LABEL}
        footer={
          <div class="text-center body-sm font-medium text-white/72">
            {locale() && t("Change language")}
          </div>
        }
      >
        <Globe class="size-6" aria-hidden="true" />
        <bdi class="locale-script" lang={locale().code}>
          {locale().nativeName}
        </bdi>
      </CapabilityTile>
    </div>
  );
}
