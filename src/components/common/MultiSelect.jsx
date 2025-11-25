"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    className,
}) {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = (item) => {
        onChange(selected.filter((i) => i !== item));
    };

    const handleSelect = (value) => {
        setInputValue("");
        if (selected.includes(value)) {
            onChange(selected.filter((i) => i !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const selectables = options.filter((option) => !selected.includes(option.value));

    return (
        <Command onKeyDown={(e) => {
            if (e.key === "Backspace" && !inputValue) {
                e.preventDefault();
                if (selected.length > 0) {
                    handleUnselect(selected[selected.length - 1]);
                }
            }
            if (e.key === "Escape") {
                inputRef.current?.blur();
            }
        }} className={`overflow-visible bg-transparent ${className}`}>
            <div
                className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-white"
            >
                <div className="flex gap-1 flex-wrap bg-white">
                    {selected.map((item) => {
                        const option = options.find((o) => o.value === item);
                        const label = option ? option.label : item;
                        return (
                            <Badge key={item} variant="secondary">
                                {label}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(item);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(item)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="ml-2 bg-transparent !ring-none outline-none placeholder:text-muted-foreground flex-1"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && selectables.length > 0 ? (
                    <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandList className="h-full max-h-60 overflow-auto bg-white">
                            {selectables.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                        handleSelect(option.value);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="cursor-pointer"
                                >
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </div>
                ) : null}
            </div>
        </Command>
    );
}
