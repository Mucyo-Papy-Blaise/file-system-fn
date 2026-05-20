"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DropdownContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  anchorRect: DOMRect | null;
  setAnchorRect: (rect: DOMRect | null) => void;
  contentId: string;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

interface DropdownMenuProps {
  children: ReactNode;
}

interface DropdownMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  ariaLabel?: string;
}

interface DropdownMenuContentProps {
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
  fullWidth?: boolean;
  width?: number;
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used within DropdownMenu");
  }

  return context;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const contentId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;

      if (
        target &&
        target instanceof Element &&
        target.closest(`[aria-controls="${contentId}"]`)
      ) {
        return;
      }

      const content = window.document.getElementById(contentId);
      if (content && target && content.contains(target)) {
        return;
      }

      setIsOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.document.addEventListener("mousedown", handlePointerDown);
    window.document.addEventListener("keydown", handleEscape);

    return () => {
      window.document.removeEventListener("mousedown", handlePointerDown);
      window.document.removeEventListener("keydown", handleEscape);
    };
  }, [contentId, isOpen]);

  return (
    <DropdownContext.Provider
      value={{ isOpen, setIsOpen, anchorRect, setAnchorRect, contentId }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild = false,
  className,
  ariaLabel,
}: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen, setAnchorRect, contentId } = useDropdown();

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    setAnchorRect(event.currentTarget.getBoundingClientRect());
    setIsOpen(!isOpen);
  };

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error("DropdownMenuTrigger with asChild requires a single React element child");
    }

    const child = children as ReactElement<any>;

    return cloneElement(child, {
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        child.props.onClick?.(event);

        if (!event.defaultPrevented) {
          handleClick(event);
        }
      },
      "aria-expanded": isOpen,
      "aria-haspopup": "menu",
      "aria-controls": contentId,
      "aria-label": ariaLabel,
      className: joinClassNames(child.props.className, className),
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-controls={contentId}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  align = "start",
  className,
  fullWidth = false,
  width,
}: DropdownMenuContentProps) {
  const { isOpen, anchorRect, contentId } = useDropdown();

  if (!isOpen || !anchorRect || typeof window === "undefined") {
    return null;
  }

  const bottomSpace = window.innerHeight - anchorRect.bottom;
  const topSpace = anchorRect.top;
  const shouldOpenAbove = topSpace > bottomSpace && topSpace > 220;

  const placementStyle = shouldOpenAbove
    ? {
        position: "fixed" as const,
        bottom: window.innerHeight - anchorRect.top + 8,
      }
    : {
        position: "fixed" as const,
        top: anchorRect.bottom + 8,
      };

  const style =
    align === "end"
      ? {
          ...placementStyle,
          right: window.innerWidth - anchorRect.right,
          width: width ?? (fullWidth ? anchorRect.width : undefined),
        }
      : {
          ...placementStyle,
          left: anchorRect.left,
          width: width ?? (fullWidth ? anchorRect.width : undefined),
        };

  return createPortal(
    <div
      id={contentId}
      role="menu"
      style={style}
      className={joinClassNames(
        "z-[1000] min-w-48 overflow-hidden border border-default bg-surface",
        className,
      )}
    >
      {children}
    </div>,
    window.document.body,
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled = false,
  className,
}: DropdownMenuItemProps) {
  const { setIsOpen } = useDropdown();

  const handleClick = () => {
    if (disabled) {
      return;
    }

    onClick?.();
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      className={joinClassNames(
        "w-full px-4 py-3 text-left text-sm transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
