import { Icons } from "@/components/icons"

const Loading = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Icons.Loader className="mr-2 size-8 animate-spin" />
    </div>
  )
}

export default Loading