import { ProfileForm } from "./_components/profile-form"
import { getLatestUser } from "@/lib/auth"
import { SettingsTitle } from "./_components/settings-title"

const SettingPage = async () => {
  const userinfo = await getLatestUser()

  return (
    <div className='space-y-6'>
      <SettingsTitle title="Profile" description="This is how others will see you on the site." />
      <ProfileForm initialValues={{
        username: userinfo?.name!,
        email: userinfo?.email!,
        image: userinfo?.image || "",
      }} />
    </div>
  )
}

export default SettingPage