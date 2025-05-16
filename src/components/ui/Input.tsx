import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full rounded-lg border border-gray-500 px-4 py-2 text-base shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = "Input";

export { Input };