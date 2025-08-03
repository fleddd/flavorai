import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ children, className, ...rest }: PropsWithChildren<TypeButton>) {
    return <button className={twMerge("bg-primary text-white rounded-md py-2 cursor-pointer hover:bg-primary/90 transition-all ease", className)} {...rest}>{children}</button>
}
