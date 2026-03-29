const currency = { currencyCode: 'INR', currencySymbol: '₹', country: 'India' }

export const users = [
  { email: 'john.doe@company.com', password: 'password123', name: 'John Doe', role: 'manager', ...currency },
  { email: 'jane.smith@company.com', password: 'password123', name: 'Jane Smith', role: 'manager', ...currency },
  { email: 'admin@company.com', password: 'password123', name: 'Company Admin', role: 'admin', ...currency },
  { email: 'adminJr@company.com', password: 'password123', name: 'Jr Admin', role: 'admin', ...currency }
]
