import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import { TaskbarItem } from "@acme/ui/os/taskbar";
import { Database, LayoutGrid, Search, Settings, Zap } from "lucide-react";

function ProductMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TaskbarItem
          variant="label"
          className="text-slate-700 hover:bg-black/5 data-[active=true]:bg-black/5"
        >
          Orbit Desk
        </TaskbarItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={10}
        align="start"
        className="z-300 w-72 rounded-xl p-2 shadow-xl"
      >
        <DropdownMenuItem className="gap-3">
          <LayoutGrid className="size-4" /> Mission control
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <Search className="size-4" /> Find anything
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <Settings className="size-4" /> Workspace tuning
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-3">
            <Database className="size-4 text-sky-600" /> Stations
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="z-300 w-64 rounded-xl p-2 shadow-xl">
            <DropdownMenuItem>Signal studio</DropdownMenuItem>
            <DropdownMenuItem>Focus chamber</DropdownMenuItem>
            <DropdownMenuItem>Feedback observatory</DropdownMenuItem>
            <DropdownMenuItem>Release hangar</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-3">
            <Zap className="size-4 text-emerald-600" /> Routines
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="z-300 w-64 rounded-xl p-2 shadow-xl">
            <DropdownMenuItem>Morning scan</DropdownMenuItem>
            <DropdownMenuItem>Alignment sync</DropdownMenuItem>
            <DropdownMenuItem>Ship checklist</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TaskbarItem
          variant="label"
          className="text-slate-700 hover:bg-black/5 data-[active=true]:bg-black/5"
        >
          Extras
        </TaskbarItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={10}
        align="start"
        className="z-300 w-64 rounded-xl p-2 shadow-xl"
      >
        <DropdownMenuItem>Field guide</DropdownMenuItem>
        <DropdownMenuItem>Scene library</DropdownMenuItem>
        <DropdownMenuItem>Connectors</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Quick actions</DropdownMenuItem>
        <DropdownMenuItem>System telemetry</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { MoreMenu, ProductMenu };
