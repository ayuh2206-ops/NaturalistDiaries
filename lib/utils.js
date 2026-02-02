// Simple hash function for password
export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Get background image URL based on device type
export function getBackgroundImage(bg, isMobile = false) {
  if (typeof bg === 'string') {
    return bg;
  }
  return (isMobile && bg.mobile) ? bg.mobile : bg.desktop;
}

// Get background position
export function getBackgroundPosition(bg) {
  if (typeof bg === 'string') {
    return 'center center';
  }
  return bg.position || 'center center';
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Export submissions to CSV
export function exportToCSV(submissions) {
  if (submissions.length === 0) return null;
  
  const headers = [
    'Date', 'Name', 'Email', 'Phone', 'Location', 
    'Destination', 'Travellers', 'Budget India', 
    'Budget Africa', 'Description', 'Status'
  ];
  
  const csv = [headers.join(',')];
  
  submissions.forEach(s => {
    csv.push([
      s.date,
      s.name,
      s.email,
      s.phone,
      s.location,
      s.destination,
      s.travellers,
      s.budgetIndia,
      s.budgetAfrica,
      `"${s.description}"`,
      s.status
    ].join(','));
  });
  
  return csv.join('\n');
}

// Download file helper
export function downloadFile(content, filename, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
