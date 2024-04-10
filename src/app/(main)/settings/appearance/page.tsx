import { getLatestUser } from "@/lib/auth"
import { SettingsTitle } from "../_components/settings-title"
import { AppearanceForm } from "./_components/appearance-form"

const AppearancePage = async () => {
  const userinfo = await getLatestUser()

  return (
    <div className="space-y-6">
      <SettingsTitle title="Appearance" description="Customize the appearance of the app. This will only affect your view of the app." />
      <AppearanceForm initialValues={{
        theme: userinfo?.theme!,
      }} />
    </div>
  )
}

export default AppearancePage