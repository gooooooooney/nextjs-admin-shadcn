import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import Image from 'next/image'

const NotFound = () => {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Image
          src="/crashed-error.svg"
          width={300}
          height={300}
          alt="404"
          className=" rounded-3xl dark:brightness-200 dark:grayscale" />
        <h1 className='text-[4rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Page not found</span>
        <p className='text-center text-muted-foreground'>
          Sorry, we couldn’t find the page you’re looking for.
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
    // <div className="w-full lg:grid lg:grid-cols-2 h-screen">
    //   <div className="hidden bg-muted lg:block">
    //     <Image
    //       src="/crashed-error.svg"
    //       alt="Image"
    //       width="500"
    //       height="500"
    //       className="h-full w-full  dark:brightness-[0.5] dark:grayscale"
    //     />
    //   </div>
    //   <div className="flex flex-col items-center justify-center py-12">
    //     <h1 className='text-[4rem] font-bold leading-tight'>404</h1>
    //     <span className='font-medium'>Page not found</span>
    //     <p className='text-center text-muted-foreground'>
    //       Sorry, we couldn’t find the page you’re looking for.
    //     </p>
    //     <div className='mt-6 flex gap-4'>

    //       <Button asChild >
    //         <Link href="/">
    //           Back to Home
    //         </Link>
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  )
}

export default NotFound