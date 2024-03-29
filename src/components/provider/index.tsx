import React from 'react'
import { ThemeProvider } from './theme-provider'

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {
                    children
                }
            </ThemeProvider>
        </>
    )
}
