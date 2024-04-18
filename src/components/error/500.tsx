import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import Image from 'next/image'

export const ErrorComponent = () => {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Image
          src="/falling.svg"
          width={300}
          height={300}
          alt="404"
          className=" rounded-3xl dark:brightness-200 dark:grayscale" />
        <h1 className='text-[4rem] font-bold leading-tight'>500</h1>
        <span className='font-medium'>Oops! Something went wrong :')
        </span>
        <p className='text-center text-muted-foreground'>
          We apologize for the inconvenience.
          Please try again later.
        </p>
        <div className='mt-6 flex gap-4'>

          <Button asChild >
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
