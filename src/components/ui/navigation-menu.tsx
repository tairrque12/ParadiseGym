"use client"

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  ...props
}: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative flex", className)}
      {...props}
    />
  )
}

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex flex-nowrap items-center", className)}
      {...props}
    />
  )
}

function NavigationMenuItem({
  ...props
}: NavigationMenuPrimitive.Item.Props) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "inline-flex h-11 items-center whitespace-nowrap px-2.5 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
}
