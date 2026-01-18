import {
  ChevronsUpDown,
  ChevronRight,
  LogOut,
  Palette,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import SidebarThemeChanger from "@/components/sidebar/sidebar-theme-changer"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default function SidebarUsers() {
  const { isMobile } = useSidebar()

  interface UserProps {
    name: string,
    email: string,
    avatar: string,
  }

  const user: UserProps =
  {
    name: "Nicholas Tickle",
    email: "nicholas@theprojectmachine.com",
    avatar: "/images/avatars/robert-fox.png",
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar
                } alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg ${!isMobile ? 'translate-x-10 -translate-y-3' : ''} bg-sidebar-options-background shadow-md border border-sidebar-border text-foreground`}
            side={isMobile ? "bottom" : "right"}
            align="end"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-sidebar-border" />
            
            <DropdownMenuGroup>
              <SidebarThemeChanger>
                <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Palette />
                      <span>Theme</span>
                    </div>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </DropdownMenuItem>
              </SidebarThemeChanger>

            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-sidebar-border" />
            <DropdownMenuItem className="hover:bg-sidebar-accent hover:text-foreground text-xs" asChild>
              <SignOutButton
                className="hover:bg-sidebar-accent hover:text-foreground text-xs"
              >
                <LogOut />
                Sign Out
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
