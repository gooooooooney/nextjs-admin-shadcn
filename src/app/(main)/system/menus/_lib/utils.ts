import { Menu } from "@/drizzle/schema"
import {
  CheckCircledIcon, CrossCircledIcon
} from "@radix-ui/react-icons"

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Menu["status"]) {
  const statusIcons = {
    inactive: CrossCircledIcon,
    active: CheckCircledIcon,
  }

  return statusIcons[status!] || CrossCircledIcon
}
