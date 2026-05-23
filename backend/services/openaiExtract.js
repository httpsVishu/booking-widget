function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

export async function extractSchema(prompt) {
  const lower = prompt.toLowerCase();

  let businessName = 'Custom Business';
  let services = [];
  let workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let workingHours = { start: '09:00', end: '18:00' };
  let slotInterval = 30;

  if (lower.includes('hvac')) {
    businessName = 'Cool Breeze HVAC';

    services = [
      {
        id: 'ac-repair',
        name: 'AC Repair',
        duration: 120,
        deposit: 75
      },
      {
        id: 'duct-cleaning',
        name: 'Duct Cleaning',
        duration: 180,
        deposit: 100
      },
      {
        id: 'maintenance',
        name: 'HVAC Maintenance',
        duration: 90,
        deposit: 50
      }
    ];

    slotInterval = 30;
  }

  else if (
    lower.includes('spa') ||
    lower.includes('massage')
  ) {
    businessName = 'Luxury Spa Studio';

    services = [
      {
        id: 'spa-session',
        name: 'Spa Session',
        duration: 30,
        deposit: 200
      },
      {
        id: 'full-body-massage',
        name: 'Full Body Massage',
        duration: 60,
        deposit: 500
      },
      {
        id: 'facial-treatment',
        name: 'Facial Treatment',
        duration: 45,
        deposit: 300
      }
    ];

    workingDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    workingHours = {
      start: '10:00',
      end: '20:00'
    };

    slotInterval = 30;
  }

  else if (lower.includes('barber')) {
    businessName = 'Sharp Edge Barber';

    services = [
      {
        id: 'haircut',
        name: 'Haircut',
        duration: 30,
        deposit: 50
      },
      {
        id: 'beard-trim',
        name: 'Beard Trim',
        duration: 20,
        deposit: 20
      }
    ];

    workingDays = [
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
  }

  else {
    services = [
      {
        id: slugify('Consultation'),
        name: 'Consultation',
        duration: 30,
        deposit: 50
      },
      {
        id: slugify('Main Service'),
        name: 'Main Service',
        duration: 60,
        deposit: 100
      }
    ];
  }

  return {
    businessName,
    services,
    workingDays,
    workingHours,
    slotInterval
  };
}