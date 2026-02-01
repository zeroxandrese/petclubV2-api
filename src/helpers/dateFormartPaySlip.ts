export const formatPeriodo = (periodo: string): string => {
    if (!periodo || periodo.length !== 6) return periodo;
  
    const year = periodo.slice(0, 4);
    const month = periodo.slice(4, 6);
  
    const months: Record<string, string> = {
      '01': 'Ene',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dic',
    };
  
    return `${months[month]}-${year.slice(2)}`;
  };