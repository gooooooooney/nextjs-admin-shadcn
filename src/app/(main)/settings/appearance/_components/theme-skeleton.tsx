import { Skeleton } from "@/components/ui/skeleton"
import { Theme } from "@/drizzle/schema"
import { cn } from "@/lib/utils"


type ThemeSkeletonProps = {
  theme: Theme
}

export function ThemeSkeleton({ theme }: ThemeSkeletonProps) {
  const themeClassName: Record<Theme, string> = {
    light: "bg-white",
    dark: "bg-slate-800",
    system: "bg-gray-800",
  }
  return (
    <>
      <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
        <div className={cn('space-y-2 rounded-sm bg-gray-200 p-2', theme === Theme.Enum.dark && 'bg-slate-950')}>
          <div className={cn('space-y-2 rounded-md  p-2 shadow-sm', themeClassName[theme])}>
            <div className={cn('h-2 w-[80px] rounded-lg bg-gray-200', theme === Theme.Enum.dark &&'bg-slate-400')} />
            <div className={cn('h-2 w-[100px] rounded-lg bg-gray-200', theme === Theme.Enum.dark &&'bg-slate-400')} />
          </div>
          <div className={cn('flex items-center space-x-2 rounded-md  p-2 shadow-sm', themeClassName[theme])}>
            <div className={cn('h-4 w-4 rounded-full bg-gray-200', theme === Theme.Enum.dark &&'bg-slate-400')} />
            <div className={cn('h-2 w-[100px] rounded-lg bg-gray-200', theme === Theme.Enum.dark &&'bg-slate-400')} />
          </div>
          <div className={cn('flex items-center space-x-2 rounded-md  p-2 shadow-sm', themeClassName[theme])}>
            <div className={cn('h-4 w-4 rounded-full bg-gray-200', theme === Theme.Enum.dark &&'bg-slate-400')} />
            <div className={cn('h-2 w-[100px] rounded-lg bg-gray-200', theme === Theme.Enum.dark &&'bg-slate-400')} />
          </div>
        </div>
      </div>
      <span className='block w-full p-2 text-center font-normal capitalize'>
        {theme}
      </span>
    </>
  )
}
