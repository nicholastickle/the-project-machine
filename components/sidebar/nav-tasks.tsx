import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NewTask } from "./new-task"

export function NavTasks({
  tasks,
}: {
  tasks: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    tasks?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">

      <SidebarMenu>
        {tasks.map((task) => (
          <Collapsible
            key={task.title}
            asChild
            defaultOpen={task.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={task.title}>
                  {task.icon && <task.icon />}
                  <span>{task.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <NewTask />

                  {task.tasks?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title} className="flex items-center">
                      <SidebarMenuSubButton asChild className="flex-1">
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}

                </SidebarMenuSub>

              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
