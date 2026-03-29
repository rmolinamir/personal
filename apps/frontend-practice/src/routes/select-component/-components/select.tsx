import { cn } from "@acme/ui/lib/utils";
import React from "react";

type SelectContextValue = {
  open: boolean;
  value: string | number | undefined;
  displayValue: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  setDisplayValue: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Missing SelectContext.Provider.");
  return context;
}

type SelectProps = React.ComponentProps<"div"> &
  Pick<React.ComponentProps<"input">, "name">;

export function Select({ className, name, ...props }: SelectProps) {
  const [open, setOpen] = React.useState<SelectContextValue["open"]>(false);
  const [value, setValue] =
    React.useState<SelectContextValue["value"]>(undefined);
  const [displayValue, setDisplayValue] =
    React.useState<SelectContextValue["displayValue"]>(null);

  const context = {
    displayValue,
    open,
    setDisplayValue,
    setOpen,
    setValue,
    value,
  };

  return (
    <SelectContext.Provider value={context}>
      <div className={cn("relative", className)} {...props} />
      {name && <input className="hidden" name={name} value={value} />}
    </SelectContext.Provider>
  );
}

type SelectBoxLabelProps = React.ComponentProps<"div">;

export function SelectLabel(props: SelectBoxLabelProps) {
  return <div {...props} />;
}

type SelectTriggerProps = React.ComponentProps<"button">;

export function SelectTrigger({ onClick, ...props }: SelectTriggerProps) {
  const { open, setOpen } = useSelect();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (event.defaultPrevented) return;
    setOpen((prev) => !prev);
  }

  return (
    <button
      className="w-full rounded border p-2 text-left"
      role="combobox"
      aria-controls="select-list"
      aria-expanded={open}
      aria-labelledby="select-label"
      onClick={handleClick}
      {...props}
    />
  );
}

type SelectValueProps = React.ComponentProps<"div">;

export function SelectValue({ children, onClick, ...props }: SelectValueProps) {
  const { value, displayValue } = useSelect();
  return <div {...props}>{displayValue ?? value ?? children}</div>;
}

type SelectListProps = React.ComponentProps<"div">;

export function SelectList({
  className,
  onClick,
  onBlur,
  onKeyDown,
  ...props
}: SelectListProps) {
  const { open, setOpen } = useSelect();

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Enter") {
      setOpen((prev) => !prev);
    } else if (
      event.key === "ArrowUp" &&
      document.activeElement?.previousElementSibling instanceof HTMLElement
    ) {
      document.activeElement.previousElementSibling.focus();
    } else if (
      event.key === "ArrowDown" &&
      document.activeElement?.nextElementSibling instanceof HTMLElement
    ) {
      document.activeElement.nextElementSibling.focus();
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    onBlur?.(event);
    if (event.defaultPrevented) return;

    // focus still inside list
    if (event.currentTarget.contains(event.relatedTarget)) return;

    // If focus is moving anywhere inside the same Select wrapper
    if (event.currentTarget.parentElement?.contains(event.relatedTarget))
      return;

    setOpen(false);
  }

  // Forces `autoFocus` on the list options to trigger
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0",
        "w-full border p-2",
        "flex flex-col items-start justify-start",
        className,
      )}
      role="listbox"
      onKeyDown={handleOnKeyDown}
      onBlur={handleBlur}
      {...props}
    />
  );
}

type SelectOptionProps = React.ComponentProps<"button"> & {
  value: SelectContextValue["value"];
};

export function SelectOption({
  autoFocus,
  className,
  onClick,
  value,
  children,
  onKeyDown,
  ...props
}: SelectOptionProps) {
  const {
    value: selectedValue,
    setOpen,
    setValue,
    setDisplayValue,
  } = useSelect();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    setValue(value);
    setDisplayValue(children);
    setOpen(false);
  }

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter") {
      setValue(value);
      setDisplayValue(children);
      setOpen(false);
    }
  }

  return (
    <button
      autoFocus={autoFocus ?? selectedValue === value}
      className={cn(
        "w-full p-2 text-left disabled:cursor-not-allowed disabled:opacity-50",
        "focus:ring",
        className,
      )}
      role="option"
      onClick={handleClick}
      onKeyDown={handleOnKeyDown}
      {...props}
    >
      {children ?? value}
    </button>
  );
}
