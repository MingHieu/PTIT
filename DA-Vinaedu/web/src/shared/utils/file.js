export const FILE_TYPES = {
  document: 'document',
  pdf: 'pdf',
  spreadsheet: 'spreadsheet',
  image: 'image',
  zip: 'zip',
  default: 'default',
};

export function getFileType(fileType) {
  // Spreadsheet files
  if (
    fileType.startsWith('application/vnd.ms-excel') || // XLS
    fileType.startsWith(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ) || // XLSX
    fileType.startsWith('application/vnd.oasis.opendocument.spreadsheet') // ODS
  ) {
    return FILE_TYPES.spreadsheet;
  }

  // Document files
  if (
    fileType.startsWith(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ) || // DOCX
    fileType.startsWith('application/msword') || // DOC
    fileType.startsWith('application/vnd.oasis.opendocument.text') || // ODT
    fileType.startsWith('text/plain') // TXT
  ) {
    return FILE_TYPES.document;
  }

  // PDF files
  if (fileType.startsWith('application/pdf')) {
    return FILE_TYPES.pdf;
  }

  // Image files
  if (fileType.startsWith('image/')) {
    return FILE_TYPES.image;
  }

  // Archive files (ZIP only)
  if (fileType.startsWith('application/zip')) {
    return FILE_TYPES.zip;
  }

  // Default fallback for unknown file types
  return FILE_TYPES.default;
}
