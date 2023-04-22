export interface PDFTYPE {
	Title: string;
	Pdf: number[];
	Img: number[];
	Status: boolean;
	Url: string;
	Loading: boolean;
}

export type ExportPdf = PDFTYPE;
export interface Rule {
	rule: (arg: any) => any;
	ruleName: string;
}

export interface VrSyncStore {
	value: any;
	listeners: Set<any>;
	subscribe: () => void;
}
