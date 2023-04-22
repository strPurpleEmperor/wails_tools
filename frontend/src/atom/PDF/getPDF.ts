import { atom } from 'jotai';

import { ExportPdf, PDFTYPE } from '../../types';

export const loadingVal = atom<boolean>(false);
export const pdfVal = atom<ExportPdf | null>(null);
