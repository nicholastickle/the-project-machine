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
import { NewProject } from "@/components/sidebar/new-project"
import { OptionsProject } from "@/components/sidebar/options-project"

export function NavProjects({
  items,
  onProjectClick,
  onProjectCreated,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      id?: string
      title: string
      url: string
    }[]
  }[]
  onProjectClick?: (projectId: string) => void
  onProjectCreated?: () => void
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <NewProject onProjectCreated={onProjectCreated} />

                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id || subItem.title} className="relative group/menu-item flex items-center">
                      <SidebarMenuSubButton
                        asChild
                        className="flex-1"
                        onClick={() => subItem.id && onProjectClick?.(subItem.id)}
                      >
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                      <OptionsProject projectName={subItem.title} projectId={subItem.id} />
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
