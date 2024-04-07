import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Sidebar } from "./_components/sidebar"
import { Shell } from "@/components/layout/shell"
import { Separator } from "@/components/ui/separator"

type SettingsLayoutProps = {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <Shell >
      <Card className="border-0 relative flex h-full w-full flex-col after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:hidden after:h-32 after:w-full after:bg-[linear-gradient(180deg,_transparent_10%,_hsl(var(--background))_70%)] after:md:block md:h-[calc(90vh-var(--header-height))]">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and set e-mail preferences.
          </CardDescription>
        </CardHeader>
        <Separator className='mb-6' />
        <CardContent className="flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="sticky top-0 lg:w-1/5">
            <Sidebar />
          </aside>
          <div className="w-full p-1 pr-4">
            {children}
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </Shell>
  )
}

export default SettingsLayout