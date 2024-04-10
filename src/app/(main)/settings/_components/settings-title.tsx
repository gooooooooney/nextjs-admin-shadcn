import { Separator } from '@/components/ui/separator'
import React from 'react'


type SettingsTitleProps = {
  title: React.ReactNode
  description: React.ReactNode
}

export const SettingsTitle = ({ title, description }: SettingsTitleProps) => {
  return (
    <>
      <div>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>
          {description}
        </p>
      </div>
      <Separator className='my-4' />

    </>
  )
}
