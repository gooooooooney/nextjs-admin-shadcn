"use client";

import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
    children?: React.ReactNode;
};

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    async function signOutHandler() {
        toast.promise(signOut, {
            loading: "Signing out...",
            success: "You have been signed out.",
            error: "Something went wrong.",
        });
    }

    return (
        <span onClick={signOutHandler} className="cursor-pointer">
            {children}
        </span>
    );
};
