export interface IDynamicExcelRequestDto {
  data?: any[][];
  file_name?: string;
  headers?: string[];
  sheet_name?: string;
}

export interface IDynamicPDFRequestDto {
  file_name?: string;
  html_content?: string;
  orientation?: string;
  page_size?: string;
}
