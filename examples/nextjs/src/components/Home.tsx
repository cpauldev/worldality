"use client";

import { type ReactNode, type Ref, useEffect, useRef, useState } from "react";

import Image from "next/image";

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
  type LucideIcon,
  Monitor,
  Puzzle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { t, useCurrentLocale } from "worldality/react";
import { WorldalityWidget } from "worldality/widget";

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

type CapabilityImage = string | { src: string };

type CapabilityTileProps = {
  ariaLabel: string;
  buttonRef?: Ref<HTMLButtonElement>;
  children: ReactNode;
  footer?: ReactNode;
  href?: string;
  icon: LucideIcon;
  iconClassName: string;
  image: CapabilityImage;
  rel?: string;
  target?: string;
  title: string;
};

function CapabilityTile({
  ariaLabel,
  buttonRef,
  children,
  footer,
  href,
  icon: Icon,
  iconClassName,
  image,
  rel,
  target,
  title,
}: CapabilityTileProps) {
  const imageSrc = typeof image === "string" ? image : image.src;
  const className = cn(
    CAPABILITY_TILE_CLASS_NAME,
    CARD_ELEVATION_SHADOW_CLASS_NAME,
    CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
  );
  const content = (
    <>
      <div aria-hidden="true" className={CAPABILITY_IMAGE_WRAPPER_CLASS_NAME}>
        <Image
          fill
          src={imageSrc}
          alt=""
          className={CAPABILITY_IMAGE_CLASS_NAME}
          sizes="100vw"
        />
      </div>
      <div aria-hidden="true" className={CAPABILITY_OVERLAY_CLASS_NAME} />
      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4">
        <div className={CAPABILITY_ICON_FRAME_CLASS_NAME}>
          <Icon aria-hidden="true" className={iconClassName} />
        </div>
        <h4 className="text-white">{title}</h4>
        <div className={CAPABILITY_CTA_CLASS_NAME}>{children}</div>
      </div>
      {footer ? (
        <div className={CAPABILITY_FOOTER_CLASS_NAME}>{footer}</div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={className}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

export function Home() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const widget = new WorldalityWidget({
      position: "bottom-center",
      showSettings: true,
      theme,
    });
    const detach = buttonRef.current
      ? widget.attachTo(buttonRef.current)
      : undefined;
    return () => {
      detach?.();
      widget.destroy();
    };
  }, [theme]);
  const locale = useCurrentLocale();
  const [studioStatus, setStudioStatus] = useState(() => ({
    ...getInitialStudioStatus(),
    urlLabel: "",
  }));

  useEffect(() => {
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

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <CapabilityTile
        ariaLabel={t("Open {studio}", {
          studio: WORLDALITY_STUDIO_LABEL,
        })}
        href="/worldality"
        target="_blank"
        rel="noreferrer"
        icon={Monitor}
        iconClassName="text-blue-500"
        image={studioPreviewImage}
        title={WORLDALITY_STUDIO_LABEL}
        footer={
          <div className="body-sm flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <span
              className={cn(
                "font-medium",
                getStudioStatusClassName(studioStatus.tone),
              )}
            >
              {studioStatus.isLoading ? (
                <LoaderCircle
                  className="me-1 inline size-3.5 animate-spin align-[-2px]"
                  aria-hidden="true"
                />
              ) : null}
              {translateStudioStatusLabel(studioStatus.label)}
            </span>
            {studioStatus.urlLabel ? (
              <>
                <span className="text-white/48" aria-hidden="true">
                  /
                </span>
                <bdi className="text-white/72" dir="ltr">
                  {studioStatus.urlLabel}
                </bdi>
              </>
            ) : null}
          </div>
        }
      >
        {t("Open {studio}", { studio: "Studio" })}
        <ArrowUpRight
          className={cn("size-6", locale.direction === "rtl" && "-scale-x-100")}
          aria-hidden="true"
        />
      </CapabilityTile>

      <CapabilityTile
        ariaLabel={t("Change language")}
        buttonRef={buttonRef}
        icon={Puzzle}
        iconClassName="text-rose-500"
        image={widgetPreviewImage}
        title={WORLDALITY_WIDGET_LABEL}
        footer={
          <div className="body-sm text-center font-medium text-white/72">
            {t("Change language")}
          </div>
        }
      >
        <Globe className="size-6" aria-hidden="true" />
        <bdi className="locale-script" lang={locale.code}>
          {locale.nativeName}
        </bdi>
      </CapabilityTile>
    </div>
  );
}
