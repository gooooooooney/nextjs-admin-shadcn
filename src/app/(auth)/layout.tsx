import React from 'react'
import Image from "next/image"


type AuthLayoutProps = {
    children: React.ReactNode

}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="w-full lg:grid lg:grid-cols-2 h-screen">
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/home-office.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
                />
            </div>
            <div className="flex items-center justify-center py-12">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout