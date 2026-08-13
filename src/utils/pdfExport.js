import html2pdf from 'html2pdf.js';

export const exportToPDF = (elementId, filename = 'Proposta_Orcamento.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Elemento para emissão de PDF não encontrado.');
    return;
  }

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};
