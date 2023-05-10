import * as React from "react";
import { cn } from "@/utils/utils";
export type InputStatus = "default" | "error" | "success" | undefined;
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  status?: InputStatus;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, status, ...props }, ref) => {
    function getStatusColor(status: InputStatus) {
      switch (status) {
        case "error":
          return "bg-red-100 border-red-400";
        case "success":
          return "bg-green-100 border-green-400";
        default:
          return "";
      }
    }
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          getStatusColor(status)
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
