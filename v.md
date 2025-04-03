"use client"

import { useState } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import {
  Building2,
  Calendar,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Users,
  Bell,
  CheckCircle,
  UserPlus,
  Eye,
  FileOutput,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)

  // Sample data for charts
  const projectCategoriesData = {
    labels: ["Residencial", "Comercial", "Industrial", "Urbano", "Concepto"],
    datasets: [
      {
        label: "Proyectos por Categoría",
        data: [42, 28, 16, 12, 8],
        backgroundColor: [
          "rgba(30, 58, 138, 0.8)",
          "rgba(30, 58, 138, 0.6)",
          "rgba(30, 58, 138, 0.4)",
          "rgba(30, 58, 138, 0.3)",
          "rgba(30, 58, 138, 0.2)",
        ],
        borderColor: [
          "rgba(30, 58, 138, 1)",
          "rgba(30, 58, 138, 1)",
          "rgba(30, 58, 138, 1)",
          "rgba(30, 58, 138, 1)",
          "rgba(30, 58, 138, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Sample data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "Proyecto creado",
      name: "Torre Mirador Residencial",
      user: "Carlos Mendoza",
      date: "2023-04-02",
      time: "14:30",
    },
    {
      id: 2,
      type: "Miembro añadido",
      name: "Ana Martínez",
      user: "Miguel Sánchez",
      date: "2023-04-01",
      time: "11:15",
    },
    {
      id: 3,
      type: "Proyecto actualizado",
      name: "Centro Comercial Alameda",
      user: "Laura Gómez",
      date: "2023-03-30",
      time: "16:45",
    },
    {
      id: 4,
      type: "Proyecto completado",
      name: "Parque Industrial Norte",
      user: "Javier Rodríguez",
      date: "2023-03-28",
      time: "09:20",
    },
    {
      id: 5,
      type: "Documento añadido",
      name: "Planos Edificio Central",
      user: "Elena Torres",
      date: "2023-03-27",
      time: "13:10",
    },
  ]

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <div className="flex">
            <Sidebar className="border-r" variant="sidebar" collapsible="icon">
              <SidebarHeader className="flex h-14 items-center border-b px-4">
                <div className="flex items-center gap-2 font-semibold text-lg text-primary">
                  <Building2 className="h-6 w-6" />
                  <span>ArquiVision</span>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Proyectos">
                      <FileText className="h-5 w-5" />
                      <span>Proyectos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Equipo">
                      <Users className="h-5 w-5" />
                      <span>Equipo</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Configuración">
                      <Settings className="h-5 w-5" />
                      <span>Configuración</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="border-t p-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Cerrar sesión">
                      <LogOut className="h-5 w-5" />
                      <span>Cerrar sesión</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                <SidebarTrigger />
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <form className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                    />
                  </form>
                  <Button variant="outline" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      3
                    </span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full" aria-label="Toggle theme">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt="Miguel Sánchez" />
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <span className="ml-2 hidden md:inline-flex">Miguel Sánchez</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>Tema Claro</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>Tema Oscuro</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>Tema del Sistema</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>
              <main className="grid flex-1 items-start gap-4 p-4 md:gap-6 md:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total de Proyectos</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">106</div>
                      <p className="text-xs text-muted-foreground">+12 desde el mes pasado</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Miembros del Equipo</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">38</div>
                      <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Proyectos por Categoría</CardTitle>
                      <CardDescription>Distribución de proyectos según su tipo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        {loading ? (
                          <div className="flex h-full items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          </div>
                        ) : (
                          <Bar
                            data={projectCategoriesData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Distribución de Proyectos</CardTitle>
                      <CardDescription>Porcentaje por categoría</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        {loading ? (
                          <div className="flex h-full items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          </div>
                        ) : (
                          <Doughnut
                            data={projectCategoriesData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: "65%",
                            }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Gestionar Proyectos</CardTitle>
                      <CardDescription>Crear, editar y administrar proyectos</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center justify-center">
                      <Button size="lg" className="h-20 w-full gap-4 text-lg">
                        <FileText className="h-6 w-6" />
                        GESTIONAR PROYECTOS
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Gestionar Equipo</CardTitle>
                      <CardDescription>Administrar miembros y asignaciones</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center justify-center">
                      <Button size="lg" className="h-20 w-full gap-4 text-lg">
                        <Users className="h-6 w-6" />
                        GESTIONAR EQUIPO
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimas acciones realizadas en la plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex h-[200px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Hora</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentActivity.map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell>
                                <Badge
                                  variant={
                                    activity.type.includes("creado")
                                      ? "default"
                                      : activity.type.includes("actualizado")
                                        ? "secondary"
                                        : activity.type.includes("completado")
                                          ? "success"
                                          : "outline"
                                  }
                                >
                                  {activity.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{activity.name}</TableCell>
                              <TableCell>{activity.user}</TableCell>
                              <TableCell>{activity.date}</TableCell>
                              <TableCell>{activity.time}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <Button className="justify-start gap-2">
                        <Plus className="h-4 w-4" />
                        Crear nuevo proyecto
                      </Button>
                      <Button className="justify-start gap-2" variant="outline">
                        <UserPlus className="h-4 w-4" />
                        Añadir miembro
                      </Button>
                      <Button className="justify-start gap-2" variant="outline">
                        <Eye className="h-4 w-4" />
                        Ver portafolio público
                      </Button>
                      <Button className="justify-start gap-2" variant="outline">
                        <FileOutput className="h-4 w-4" />
                        Generar informe
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Calendario de Proyectos</CardTitle>
                      <CardDescription>Próximos hitos y entregas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">Entrega Torre Mirador</p>
                            <p className="text-sm text-muted-foreground">5 de abril, 2023</p>
                          </div>
                          <Badge>Próximo</Badge>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">Revisión Centro Comercial</p>
                            <p className="text-sm text-muted-foreground">12 de abril, 2023</p>
                          </div>
                          <Badge variant="outline">Programado</Badge>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">Inicio Proyecto Urbano</p>
                            <p className="text-sm text-muted-foreground">20 de abril, 2023</p>
                          </div>
                          <Badge variant="outline">Programado</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}





import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }




import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config




@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 33.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 33.3%;
    --radius: 0.5rem;

    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 222.2 84% 4.9%;
    --sidebar-primary: 221.2 83.2% 33.3%;
    --sidebar-primary-foreground: 210 40% 98%;
    --sidebar-accent: 210 40% 96.1%;
    --sidebar-accent-foreground: 222.2 47.4% 11.2%;
    --sidebar-border: 214.3 31.8% 91.4%;
    --sidebar-ring: 221.2 83.2% 33.3%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;

    --sidebar-background: 222.2 84% 4.9%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 217.2 91.2% 59.8%;
    --sidebar-primary-foreground: 222.2 47.4% 11.2%;
    --sidebar-accent: 217.2 32.6% 17.5%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 217.2 32.6% 17.5%;
    --sidebar-ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

