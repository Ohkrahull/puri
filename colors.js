// colors.js
export const colors = {
    base: {
      white: '#FFFFFF',
      black: '#000000',
    },
    gray: {
      25: '#F9F9FB',
      50: '#F3F4F6',
      100: '#E5E7EB',
      200: '#D1D5DB',
      300: '#9CA3AF',
      400: '#6B728D',
      500: '#4B5563',
      600: '#374151',
      700: '#1F2937',
      800: '#111827',
      900: '#030712',
    },
    blue: {
      25: '#F5F8FF',
      50: '#DBEAFE',
      100: '#3B82F6',
      200: '#1D4ED8',
      300:'#0EA5E9'
    },
    red: {
      25: '#FEF2F2',
      50: '#DC2626',
      100: '#991B1B',
    },
    green: {
      25: '#F0FDF4',
      50: '#16A34A',
      100: '#166534',
    },
    yellow: {
      25: '#F9FBE8',
      50: '#A16207',
    },
  };
  
  // CSS Custom Properties
  export const cssVariables = `
    :root {
      /* Base Colors */
      --color-white: ${colors.base.white};
      --color-black: ${colors.base.black};
  
      /* Gray Scale */
      --color-gray-25: ${colors.gray[25]};
      --color-gray-50: ${colors.gray[50]};
      --color-gray-100: ${colors.gray[100]};
      --color-gray-200: ${colors.gray[200]};
      --color-gray-300: ${colors.gray[300]};
      --color-gray-400: ${colors.gray[400]};
      --color-gray-500: ${colors.gray[500]};
      --color-gray-600: ${colors.gray[600]};
      --color-gray-700: ${colors.gray[700]};
      --color-gray-800: ${colors.gray[800]};
      --color-gray-900: ${colors.gray[900]};
  
      /* Blue Scale */
      --color-blue-25: ${colors.blue[25]};
      --color-blue-50: ${colors.blue[50]};
      --color-blue-100: ${colors.blue[100]};
      --color-blue-200: ${colors.blue[200]};
  --color-blue-300: ${colors.blue[300]};
      /* Red Scale */
      --color-red-25: ${colors.red[25]};
      --color-red-50: ${colors.red[50]};
      --color-red-100: ${colors.red[100]};
  
      /* Green Scale */
      --color-green-25: ${colors.green[25]};
      --color-green-50: ${colors.green[50]};
      --color-green-100: ${colors.green[100]};
  
      /* Yellow Scale */
      --color-yellow-25: ${colors.yellow[25]};
      --color-yellow-50: ${colors.yellow[50]};
    }
  `;

  