"use client"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

type PathnameItem = {
  pathname: string
  label: string
  subList?: PathnameItem[]
}

const getSubList = (list: PathnameItem[]) => {
  const start = list[0]!;
  const end = list[list.length - 1]!;
  const middle = list.slice(1, list.length - 1)!;
  const ellipsisList = [start, {
    label: "...",
    pathname: "",
    subList: middle,
  }, end]
  return {
    pathnameList: ellipsisList,
    length: ellipsisList.length,
  }
}

const getPathnameList: (pathname: string) => {
  pathnameList: PathnameItem[]
  length: number
} = (pathname: string) => {
  let list = pathname.split("/").filter(Boolean).reduce((pre, next, index) => {
    const last = pre[pre.length - 1]
    pre.push({
      // get the pathname by joining the previous pathname with the current pathname segment
      // like `/orders/management` for the second iteration
      // and `/orders/management/1` for the third iteration
      pathname: `${index !== 0 ? last?.pathname : ""}/${next}`,
      label: next,
    })
    return pre
  }, [{ pathname: "/", label: "Home" }] as PathnameItem[])

  if (list.length > 3) {
    return getSubList(list)
  }

  return {
    pathnameList: list,
    length: list.length,
  }
}

const HeaderBreadcrumbItem = ({ pathname, label, currentPathname }: { pathname: string, label: string, currentPathname: string }) => {
  return <BreadcrumbItem>
    {
      pathname === currentPathname ? (
        <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink className="capitalize" href={pathname}>{label}</BreadcrumbLink>
      )
    }
  </BreadcrumbItem>
}

const HeaderBreadcrumbItemWithDropdown = ({ subList }: { subList: PathnameItem[] }) => {
  return <DropdownMenu>
    <BreadcrumbItem>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <BreadcrumbEllipsis />
        <span className="sr-only">Toggle menu</span>
      </DropdownMenuTrigger>
    </BreadcrumbItem>
    <DropdownMenuContent align="start">
      {subList.map(({ pathname, label }) => (
        <DropdownMenuItem key={pathname}>
          <BreadcrumbLink className="capitalize" href={pathname}>{label}</BreadcrumbLink>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
}

export function HeaderBreadcrumb() {
  const currentPathname = usePathname()
  const { pathnameList, length } = getPathnameList(currentPathname)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnameList.map(({ pathname, label, subList }, index) => (
          <Fragment key={pathname}>
            {
              subList?.length ? <HeaderBreadcrumbItemWithDropdown
                subList={subList}
              /> :
                <HeaderBreadcrumbItem pathname={pathname} label={label} currentPathname={currentPathname} />}
            {index !== length - 1 && <BreadcrumbSeparator />}
          </Fragment>

        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
