import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./hooks/**/*.{js,ts,jsx,tsx,mdx}",
		"./lib/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2.5rem',
				'2xl': '3rem'
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: {
					DEFAULT: 'hsl(var(--border))',
					light: 'hsl(var(--border-light))',
					dark: 'hsl(var(--border-dark))'
				},
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
					light: 'hsl(var(--primary-light))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: {
						DEFAULT: 'hsl(var(--muted-foreground))',
						light: 'hsl(var(--muted-foreground-light))',
						dark: 'hsl(var(--muted-foreground-dark))'
					}
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar))',
					background: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
					'options-background': 'hsl(var(--sidebar-options-background))'
				},
				selection: {
					DEFAULT: 'hsl(var(--selection))',
					border: 'hsl(var(--selection-border))'
				},
				toolbar: {
					DEFAULT: 'hsl(var(--toolbar))',
					background: 'hsl(var(--toolbar-background))',
					foreground: 'hsl(var(--toolbar-foreground))',
					accent: 'hsl(var(--toolbar-accent))',
					'accent-foreground': 'hsl(var(--toolbar-accent-foreground))',
					border: 'hsl(var(--toolbar-border))'
				},
				control: {
					DEFAULT: 'hsl(var(--control))',
					background: 'hsl(var(--control-background))',
					foreground: 'hsl(var(--control-foreground))',
					accent: 'hsl(var(--control-accent))',
					'accent-foreground': 'hsl(var(--control-accent-foreground))',
					border: 'hsl(var(--control-border))'
				},
				minimap: {
					background: 'hsl(var(--minimap-background))',
					mask: 'hsl(var(--minimap-mask))',
					'mask-stroke': 'hsl(var(--minimap-mask-stroke))',
					border: 'hsl(var(--minimap-border))',
					'nodes': 'hsl(var(--minimap-nodes))'
				},
				'task-card': {
					background: 'hsl(var(--task-card-background))',
					'background-accent': 'hsl(var(--task-card-background-accent))',
					foreground: 'hsl(var(--task-card-foreground))',
					border: 'hsl(var(--task-card-border))',
					'icon-foreground': 'hsl(var(--task-card-icon-foreground))',
					'border-accent': 'hsl(var(--task-card-border-accent))',
					accent: 'hsl(var(--task-card-accent))',
					'accent-foreground': 'hsl(var(--task-card-accent-foreground))',
					complete: 'hsl(var(--task-card-complete))',
					'not-started': 'hsl(var(--task-card-not-started))',
					'on-going': 'hsl(var(--task-card-on-going))',
					stuck: 'hsl(var(--task-card-stuck))',
					abandoned: 'hsl(var(--task-card-abandoned))',
					'handles-background': 'hsl(var(--task-card-handles-background))',
					'edges': 'hsl(var(--edges))',
					'placeholder': 'hsl(var(--task-card-placeholder))',
					'panel-background': 'hsl(var(--task-card-panel-background))',
					'panel-background-accent': 'hsl(var(--task-card-panel-background-accent))',
					'panel-foreground': 'hsl(var(--task-card-panel-foreground))',
					'panel-accent': 'hsl(var(--task-card-panel-accent))',
					'panel-border': 'hsl(var(--task-card-panel-border))',
					'panel-placeholder': 'hsl(var(--task-card-panel-placeholder))',

					'status-options-background': 'hsl(var(--task-card-status-options-background))',
					'status-options-foreground': 'hsl(var(--task-card-status-options-foreground))',
					'status-options-border': 'hsl(var(--task-card-status-options-border))',
					'status-options-accent': 'hsl(var(--task-card-status-options-accent))'

				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
