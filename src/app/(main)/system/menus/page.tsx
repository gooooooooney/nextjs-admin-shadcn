import { searchParamsSchema } from "@/schema/data/menus"
import { getMenus } from "./_lib/queries"

interface UserPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

const MenusPage = ({ searchParams }: UserPageProps) => {
  const search = searchParamsSchema.parse(searchParams)

  const menusPromise = getMenus(search)
  return (
    <Shell variant="sidebar" className="px-4">
      <UsersTableProvider>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/**
       * The `TasksTable` component is used to render the `DataTable` component within it.
       * This is done because the table columns need to be memoized, and the `useDataTable` hook needs to be called in a client component.
       * By encapsulating the `DataTable` component within the `tasktableshell` component, we can ensure that the necessary logic and state management is handled correctly.
       */}
          <UsersTable usersPromise={menusPromise} />
        </React.Suspense>
      </UsersTableProvider>
    </Shell>
  )
}

export default MenusPage