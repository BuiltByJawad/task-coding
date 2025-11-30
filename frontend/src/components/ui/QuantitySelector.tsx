"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { cn } from "@/src/components/ui/Button"; // Re-using cn utility

interface QuantitySelectorProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    className?: string;
    disabled?: boolean;
}

export function QuantitySelector({
    value,
    min = 1,
    max = 99,
    onChange,
    className,
    disabled = false,
}: QuantitySelectorProps) {
    const [inputValue, setInputValue] = React.useState(value.toString());

    // Sync internal state with prop value
    React.useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleBlur = () => {
        let newValue = parseInt(inputValue, 10);

        if (isNaN(newValue) || newValue < min) {
            newValue = min;
        } else if (newValue > max) {
            newValue = max;
        }

        setInputValue(newValue.toString());
        if (newValue !== value) {
            onChange(newValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleBlur();
        }
    };

    return (
        <div className={cn("flex items-center border border-input rounded-md bg-background", className)}>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-l-md border-r border-input hover:bg-muted hover:text-foreground"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                type="button"
            >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-8 w-12 border-0 text-center focus-visible:ring-0 rounded-none px-0"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-r-md border-l border-input hover:bg-muted hover:text-foreground"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                type="button"
            >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase quantity</span>
            </Button>
        </div>
    );
}
