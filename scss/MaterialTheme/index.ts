import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/** LIGHT THEME -> DEFAULT **/

export const light = {
	palette: {
		type: 'light',
		background: {
			default: '#f9fafb',
			paper: common.white,
		},
		primary: {
			contrastText: '#ffffff',
			main: '#2d5016',
			light: '#7cb342',
			dark: '#1a3d0f',
		},
		secondary: {
			main: '#d4af37',
			light: '#f4e4a6',
			dark: '#b8941f',
		},
		success: {
			main: '#10b981',
		},
		error: {
			main: '#ef4444',
		},
		warning: {
			main: '#f59e0b',
		},
		info: {
			main: '#3b82f6',
		},
		text: {
			primary: '#1f2937',
			secondary: '#6b7280',
			dark: '#111827',
		},
		divider: '#e5e7eb',
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					letterSpacing: '0',
				},
			},
			defaultProps: {
				variantMapping: {
					h1: 'h1',
					h2: 'h2',
					h3: 'h3',
					h4: 'h4',
					h5: 'h5',
					h6: 'h6',
					subtitle1: 'p',
					subtitle2: 'p',
					subtitle3: 'p',
					body1: 'p',
					body2: 'p',
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: '#2d5016',
					textDecoration: 'none',
					'&:hover': {
						color: '#7cb342',
					},
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: '#e5e7eb',
				},
			},
		},
		MuiBox: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
			makeStyles: {
				root: {
					padding: 0,
				},
			},
			sx: {
				'&.MuiBox-root': {
					component: 'div',
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					maxWidth: 'inherit',
					padding: '0',
					'@media (min-width: 600px)': {
						paddingLeft: 0,
						paddingRight: 0,
					},
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: {
					background: '#ffffff',
					height: '100%',
					minHeight: '100%',
				},
				p: {
					margin: '0',
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					marginLeft: '0',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: '#1f2937',
					minWidth: 'auto',
					lineHeight: '1.2',
					boxShadow: 'none',
					borderRadius: '12px',
					padding: '10px 24px',
					fontWeight: 500,
					textTransform: 'none',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-2px)',
						boxShadow: '0 4px 12px rgba(45, 80, 22, 0.15)',
					},
				},
				contained: {
					'&.MuiButton-containedPrimary': {
						backgroundColor: '#2d5016',
						color: '#ffffff',
						'&:hover': {
							backgroundColor: '#1a3d0f',
						},
					},
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'scale(1.1)',
					},
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					MuiSelect: {
						backgroundColor: '#fafafa',
					},
					padding: '0',
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					width: '100%',
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: {
					marginRight: '0',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {},
				select: {
					textAlign: 'left',
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					input: {},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					height: '48px',
					width: '100%',
					backgroundColor: '#fff',
					borderRadius: '12px',
					transition: 'all 0.3s ease',
					'&:hover': {
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#7cb342',
						},
					},
					'&.Mui-focused': {
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#2d5016',
							borderWidth: '2px',
						},
					},
					input: {},
				},
				notchedOutline: {
					padding: '8px',
					top: '-9px',
					border: '1px solid #e5e7eb',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					margin: '5px 0 0 2px',
					lineHeight: '1.2',
				},
			},
		},
		MuiStepper: {
			styleOverrides: {
				root: {
					alignItems: 'center',
				},
			},
		},
		MuiTabPanel: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {},
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				root: {
					color: '#fff',
					borderRadius: '50%',
					border: '1px solid #e5e7eb',
					'&.Mui-active': {
						color: '#2d5016',
					},
					'&.Mui-completed': {
						color: '#10b981',
					},
				},
				text: {
					fill: '#6b7280',
				},
			},
		},
		MuiStepConnector: {
			styleOverrides: {
				line: {
					borderColor: '#e5e7eb',
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					fontSize: '14px',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					'&.Mui-checked': {
						color: '#2d5016',
					},
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '40px',
					height: '40px',
					background: '#fff',
					color: '#1f2937',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
					'&:hover': {
						background: '#2d5016',
						color: '#ffffff',
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: '12px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					MuiMenu: {
						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
					},
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					padding: '10px 16px',
					borderRadius: '8px',
					margin: '2px 8px',
					transition: 'all 0.2s ease',
					'&:hover': {
						backgroundColor: '#f9fafb',
					},
					'&.Mui-selected': {
						backgroundColor: '#b8d4a8',
						'&:hover': {
							backgroundColor: '#7cb342',
						},
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
					borderRadius: '12px',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					border: '1px solid #e5e7eb',
					color: '#1f2937',
					borderRadius: '24px',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '16px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
						transform: 'translateY(-4px)',
					},
				},
			},
		},
	},
	shadow,
	typography,
};
