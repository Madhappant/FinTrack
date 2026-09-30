import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function main() {
  console.log('🌱 Seeding Sugan Fintrack database...');

  // Clean existing demo data if any
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@suganfintrack.com' }
  });

  if (existingUser) {
    console.log('Cleaning up existing demo user...');
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create User with categories
  const user = await prisma.user.create({
    data: {
      name: 'Sugan Kumar',
      email: 'demo@suganfintrack.com',
      password: hashedPassword,
      businessName: 'Sugan Digital & Tech Solutions',
      currency: 'INR',
      phone: '+91 98765 43210',
      gstNumber: '33AABCS1429B1Z8',
      categories: {
        create: [
          // Income Categories
          { name: 'Client Retainer', type: 'INCOME', color: '#10B981', icon: 'briefcase', isDefault: true },
          { name: 'Software Development', type: 'INCOME', color: '#059669', icon: 'code', isDefault: true },
          { name: 'UI/UX Consulting', type: 'INCOME', color: '#3B82F6', icon: 'layout', isDefault: true },
          { name: 'Digital Marketing', type: 'INCOME', color: '#6366F1', icon: 'trending-up', isDefault: true },
          // Expense Categories
          { name: 'Office & Coworking', type: 'EXPENSE', color: '#F97316', icon: 'home', isDefault: true },
          { name: 'Software & Cloud Tools', type: 'EXPENSE', color: '#EF4444', icon: 'server', isDefault: true },
          { name: 'Contractors & Payroll', type: 'EXPENSE', color: '#F59E0B', icon: 'users', isDefault: true },
          { name: 'Internet & Utilities', type: 'EXPENSE', color: '#EAB308', icon: 'wifi', isDefault: true },
          { name: 'Travel & Client Meetings', type: 'EXPENSE', color: '#84CC16', icon: 'map-pin', isDefault: true },
          { name: 'Marketing & Ads', type: 'EXPENSE', color: '#06B6D4', icon: 'send', isDefault: true }
        ]
      }
    },
    include: { categories: true }
  });

  console.log(`✅ Demo user created: ${user.email} (Password: password123)`);

  const categoryMap = {};
  user.categories.forEach(c => {
    categoryMap[c.name] = c.id;
  });

  // 2. Create Clients
  const techCorp = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Rajesh Sharma',
      company: 'TechCorp India Pvt Ltd',
      email: 'rajesh@techcorp.in',
      phone: '+91 98234 11223',
      address: 'Tower B, Cyber City, Bengaluru, KA',
      gstNumber: '29AABCT1234F1Z1',
      notes: 'Quarterly retainers for mobile app maintenance'
    }
  });

  const bluePeak = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Priya Sundaram',
      company: 'BluePeak Logistics',
      email: 'priya@bluepeak.com',
      phone: '+91 94441 55667',
      address: 'Anna Salai, Chennai, TN',
      gstNumber: '33AABCB5678K1Z3',
      notes: 'Supply chain dashboard custom development'
    }
  });

  const apexRetail = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Karthik Raja',
      company: 'Apex Retail Stores',
      email: 'karthik@apexretail.in',
      phone: '+91 97890 22334',
      address: 'RS Puram, Coimbatore, TN',
      notes: 'E-commerce website & payment gateway'
    }
  });

  console.log('✅ 3 Clients created');

  // 3. Create Vendors
  const awsVendor = await prisma.vendor.create({
    data: {
      userId: user.id,
      name: 'Amazon Web Services',
      company: 'AWS Cloud Services',
      serviceType: 'Cloud Infrastructure',
      email: 'billing@aws.com'
    }
  });

  const weworkVendor = await prisma.vendor.create({
    data: {
      userId: user.id,
      name: 'WeWork Office Space',
      company: 'WeWork Management',
      serviceType: 'Coworking Desk',
      email: 'community@wework.co.in'
    }
  });

  const airtelVendor = await prisma.vendor.create({
    data: {
      userId: user.id,
      name: 'Airtel Broadband',
      company: 'Bharti Airtel Ltd',
      serviceType: 'Fiber Internet',
      email: 'support@airtel.in'
    }
  });

  console.log('✅ 3 Vendors created');

  // 4. Create Transactions for current and previous months
  const now = new Date();
  const d = (daysAgo) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  const transactionsData = [
    // Income Transactions
    {
      userId: user.id,
      type: 'INCOME',
      amount: 85000,
      date: d(3),
      description: 'Mobile App Sprint 2 Milestone Payment',
      categoryId: categoryMap['Software Development'],
      clientId: techCorp.id,
      paymentMethod: 'BANK_TRANSFER',
      taxRate: 18,
      taxAmount: 15300,
      notes: 'NEFT Transfer received'
    },
    {
      userId: user.id,
      type: 'INCOME',
      amount: 45000,
      date: d(10),
      description: 'Monthly Cloud & SEO Retainer',
      categoryId: categoryMap['Client Retainer'],
      clientId: bluePeak.id,
      paymentMethod: 'UPI',
      taxRate: 18,
      taxAmount: 8100,
      notes: 'UPI Ref: 409281729012'
    },
    {
      userId: user.id,
      type: 'INCOME',
      amount: 30000,
      date: d(18),
      description: 'Design System & UI/UX Audit',
      categoryId: categoryMap['UI/UX Consulting'],
      clientId: apexRetail.id,
      paymentMethod: 'BANK_TRANSFER',
      taxRate: 18,
      taxAmount: 5400
    },
    {
      userId: user.id,
      type: 'INCOME',
      amount: 95000,
      date: d(35),
      description: 'Full Stack Web Platform Milestone 1',
      categoryId: categoryMap['Software Development'],
      clientId: techCorp.id,
      paymentMethod: 'BANK_TRANSFER',
      taxRate: 18,
      taxAmount: 17100
    },
    {
      userId: user.id,
      type: 'INCOME',
      amount: 45000,
      date: d(42),
      description: 'Monthly Maintenance Retainer',
      categoryId: categoryMap['Client Retainer'],
      clientId: bluePeak.id,
      paymentMethod: 'UPI',
      taxRate: 18,
      taxAmount: 8100
    },

    // Expense Transactions
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 14500,
      date: d(5),
      description: 'Dedicated Coworking Space Monthly Fee',
      categoryId: categoryMap['Office & Coworking'],
      vendorId: weworkVendor.id,
      paymentMethod: 'CARD',
      taxRate: 18,
      taxAmount: 2610
    },
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 6200,
      date: d(8),
      description: 'AWS EC2 & RDS Database Hosting',
      categoryId: categoryMap['Software & Cloud Tools'],
      vendorId: awsVendor.id,
      paymentMethod: 'CARD',
      taxRate: 18,
      taxAmount: 1116
    },
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 28000,
      date: d(12),
      description: 'Contractor Payment - React Native UI polish',
      categoryId: categoryMap['Contractors & Payroll'],
      paymentMethod: 'BANK_TRANSFER',
      taxRate: 0,
      taxAmount: 0
    },
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 1999,
      date: d(15),
      description: 'Airtel Office 300Mbps Fiber Internet',
      categoryId: categoryMap['Internet & Utilities'],
      vendorId: airtelVendor.id,
      paymentMethod: 'UPI',
      taxRate: 18,
      taxAmount: 359.82
    },
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 8500,
      date: d(20),
      description: 'Google Ads & LinkedIn Sponsored Posts',
      categoryId: categoryMap['Marketing & Ads'],
      paymentMethod: 'CARD',
      taxRate: 18,
      taxAmount: 1530
    },
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 14500,
      date: d(36),
      description: 'Dedicated Coworking Space (Last Month)',
      categoryId: categoryMap['Office & Coworking'],
      vendorId: weworkVendor.id,
      paymentMethod: 'CARD',
      taxRate: 18,
      taxAmount: 2610
    },
    {
      userId: user.id,
      type: 'EXPENSE',
      amount: 5800,
      date: d(40),
      description: 'AWS Hosting Bill (Last Month)',
      categoryId: categoryMap['Software & Cloud Tools'],
      vendorId: awsVendor.id,
      paymentMethod: 'CARD',
      taxRate: 18,
      taxAmount: 1044
    }
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.create({ data: tx });
  }
  console.log(`✅ ${transactionsData.length} Sample transactions created`);

  // 5. Create Invoices
  await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: techCorp.id,
      invoiceNumber: 'INV-2026-0001',
      issueDate: d(5),
      dueDate: d(-10),
      status: 'PAID',
      subtotal: 85000,
      taxTotal: 15300,
      total: 100300,
      notes: 'Thanks for choosing Sugan Digital Solutions.',
      items: {
        create: [
          {
            description: 'Mobile App Architecture & API Integration',
            quantity: 1,
            unitPrice: 65000,
            taxRate: 18,
            amount: 76700
          },
          {
            description: 'Automated Push Notification Setup',
            quantity: 1,
            unitPrice: 20000,
            taxRate: 18,
            amount: 23600
          }
        ]
      }
    }
  });

  await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: bluePeak.id,
      invoiceNumber: 'INV-2026-0002',
      issueDate: d(2),
      dueDate: d(-13),
      status: 'PENDING',
      subtotal: 45000,
      taxTotal: 8100,
      total: 53100,
      notes: 'Payment due upon invoice delivery.',
      items: {
        create: [
          {
            description: 'Monthly Dedicated DevOps & Server Monitoring',
            quantity: 1,
            unitPrice: 45000,
            taxRate: 18,
            amount: 53100
          }
        ]
      }
    }
  });

  await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: apexRetail.id,
      invoiceNumber: 'INV-2026-0003',
      issueDate: d(25),
      dueDate: d(5), // Due 5 days ago
      status: 'OVERDUE',
      subtotal: 35000,
      taxTotal: 6300,
      total: 41300,
      notes: 'Second reminder notice sent.',
      items: {
        create: [
          {
            description: 'Payment Gateway Integration & Webhook Testing',
            quantity: 1,
            unitPrice: 35000,
            taxRate: 18,
            amount: 41300
          }
        ]
      }
    }
  });

  console.log('✅ 3 Sample invoices created');
  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
