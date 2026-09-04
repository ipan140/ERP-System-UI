export interface IConsolidationDto {
  id: number;
  name: string;
  period: string;
  branches?: string[];
  created_at: string;
}
