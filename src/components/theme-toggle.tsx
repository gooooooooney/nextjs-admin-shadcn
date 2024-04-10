"use client";

import { useTheme } from "next-themes";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

function ThemeToggle({ theme }: { theme?: string }) {
    const { setTheme, theme: nextTheme } = useTheme();
    useEffect(() => {
        if (theme) {
            setTheme(theme);
        }

    }, [])

    return (
        <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setTheme(nextTheme === "light" ? "dark" : "light")}
        >
            <Icons.Sun
                className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                aria-hidden="true"
            />

            <Icons.Moon
                className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                aria-hidden="true"
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

export default ThemeToggle;
