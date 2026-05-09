"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Bell, Search, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import React from "react"

function formatBreadcrumb(str: string) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ")
}

export function AdminTopbar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  const pathSegments = pathname.split("/").filter(Boolean)
  const isExpanded = state === "expanded"

  return (
    <div className="sticky top-0 z-50 px-4 pt-5">
      <div
        className={`
          pointer-events-none flex w-full
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isExpanded ? "justify-end" : "justify-center"}
        `}
      >
        <header
          className={`
            pointer-events-auto flex h-14 items-center gap-4
            rounded-full border border-gray-200/60
            bg-white/75 backdrop-blur-2xl
            px-5
            shadow-[0_10px_40px_rgba(0,0,0,0.06)]
            
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            will-change-[max-width,transform]

            ${
              isExpanded
                ? "max-w-[calc(100%-1rem)] lg:max-w-[980px] translate-x-0"
                : "max-w-6xl"
            }

            w-full
          `}
        >
          <div
            className={`
              flex items-center gap-4 min-w-0 w-full
              transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            `}
          >
            <SidebarTrigger className="shrink-0 text-gray-500 transition-all duration-300 hover:text-black hover:scale-105 active:scale-95" />

            <div className="h-4 w-px shrink-0 bg-gray-200 transition-all duration-500" />

            <div className="flex min-w-0 flex-1 items-center justify-between">
              <nav
                className={`
                  hidden sm:flex items-center overflow-hidden
                  text-[13px] font-normal text-gray-500
                  transition-all duration-500 ease-out
                  ${isExpanded ? "max-w-[420px]" : "max-w-[700px]"}
                `}
              >
                {pathSegments.map((segment, index) => {
                  const isLast = index === pathSegments.length - 1
                  const href = `/${pathSegments
                    .slice(0, index + 1)
                    .join("/")}`

                  return (
                    <React.Fragment key={href}>
                      <Link
                        href={href}
                        className={`
                          whitespace-nowrap transition-all duration-200
                          hover:text-black
                          ${
                            isLast
                              ? "font-medium text-gray-900"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {formatBreadcrumb(segment)}
                      </Link>

                      {!isLast && (
                        <ChevronRight
                          strokeWidth={1.5}
                          className="mx-2 size-3.5 shrink-0 text-gray-300"
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-3">
                <div
                  className={`
                    relative hidden md:flex items-center
                    text-gray-400
                    transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    focus-within:text-[#5CA3FF]

                    ${
                      isExpanded
                        ? "w-40 lg:w-48"
                        : "w-44 lg:w-60"
                    }
                  `}
                >
                  <Search
                    strokeWidth={1.5}
                    className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2"
                  />

                  <input
                    type="text"
                    placeholder="Busca global..."
                    className="
                      h-9 w-full rounded-full
                      border border-gray-200/60
                      bg-gray-50/40
                      pl-9 pr-4
                      text-[13px] font-light text-gray-900
                      outline-none

                      transition-all duration-500 ease-out

                      placeholder:text-gray-400
                      focus:border-[#5CA3FF]/50
                      focus:bg-white
                      focus:ring-4 focus:ring-[#5CA3FF]/10
                    "
                  />
                </div>

                <button
                  className="
                    relative flex size-9 items-center justify-center
                    rounded-full border border-transparent
                    text-gray-400

                    transition-all duration-300

                    hover:border-gray-200
                    hover:bg-white
                    hover:text-gray-900
                    hover:shadow-md
                    hover:scale-105

                    active:scale-95
                  "
                >
                  <Bell strokeWidth={1.5} className="size-[18px]" />

                  <span className="absolute right-2.5 top-2 size-1.5 rounded-full bg-[#5CA3FF] ring-2 ring-white"></span>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  )
}