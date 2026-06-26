const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export function toBengaliNumerals(num: number | string): string {
  return num
    .toString()
    .split('')
    .map((char) => {
      const digit = parseInt(char, 10);
      return !isNaN(digit) ? BENGALI_DIGITS[digit] : char;
    })
    .join('');
}

export function formatBengaliDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = toBengaliNumerals(date.getDate());
    const month = BENGALI_MONTHS[date.getMonth()];
    const year = toBengaliNumerals(date.getFullYear());

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = toBengaliNumerals(minutes.toString().padStart(2, '0'));

    let period = 'সকাল';
    if (hours >= 12) {
      if (hours < 16) period = 'দুপুর';
      else if (hours < 18) period = 'বিকাল';
      else if (hours < 20) period = 'সন্ধ্যা';
      else period = 'রাত';
    } else {
      if (hours < 5) period = 'রাত';
      else if (hours < 6) period = 'ভোর';
    }

    const twelveHour = hours % 12 || 12;
    const formattedHours = toBengaliNumerals(twelveHour);

    return `${day} ${month}, ${year}, ${period} ${formattedHours}:${formattedMinutes}`;
  } catch (e) {
    return dateString;
  }
}

export function getCurrentBengaliTimestamp(): string {
  return new Date().toISOString();
}
