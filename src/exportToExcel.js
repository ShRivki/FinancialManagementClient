import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
  // יצירת ספר עבודה חדש
  const workbook = XLSX.utils.book_new();
  
  // המרת הנתונים לדף עבודה
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // הוספת דף העבודה לספר העבודה
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // כתיבה של ספר העבודה לקובץ
  XLSX.writeFile(workbook, fileName);
};