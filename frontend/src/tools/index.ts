import dayjs from 'dayjs';
import { message } from 'antd';
import { ExportPdf, Rule, PDFTYPE } from '../types';
import { OpenDirectoryDialog, SaveFile, SaveFileByString, SaveFileDialog } from '../../wailsjs/go/main/App';

export function buffer2Url(buffer?: number[]) {
	if (!buffer) return '';
	return `data:image/png;base64,${window.btoa(
		new Uint8Array(buffer).reduce((res, byte) => {
			return res + String.fromCharCode(byte);
		}, '')
	)}`;
}

export function downLoadPDF(pdf: PDFTYPE | null) {
	// if (!pdf) return;
	// dialog.save({ defaultPath: `${pdf.title}.pdf` }).then((res) => {
	// 	if (res) {
	// 		fs
	// 			.writeBinaryFile(res, pdf.pdf)
	// 			.then(() => {
	// 				message.success('保存成功');
	// 			})
	// 			.catch(() => {
	// 				message.error('保存失败请联系开发者');
	// 			});
	// 	}
	// });
}
export function openDirectory() {
	return OpenDirectoryDialog({});
}
export function saveFileDialog(filename: string): Promise<string> {
	return SaveFileDialog({ DefaultFilename: filename });
}
export function saveFile(fileName: string, data: number[]) {
	saveFileDialog(fileName).then((url) => {
		SaveFile(url, data).then((res) => {
			if (res) {
				message.success('保存成功');
			} else {
				message.error('保存失败');
			}
		});
	});
}
export function downLoadExPDF(pdf: ExportPdf | null) {
	if (!pdf) return;
	saveFile(`${pdf.Title}.pdf`, pdf.Pdf);
}

export function saveFileByString(fileName: string, data: string) {
	saveFileDialog(fileName).then((url) => {
		SaveFileByString(url, data).then((res) => {
			if (res) {
				message.success('保存成功');
			} else {
				message.error('保存失败');
			}
		});
	});
}
export function getFileType(v?: string): [string, string] {
	if (!v) return ['', ''];
	const arr = v.split('.');

	if (arr.length > 1) {
		const suffix = arr[arr.length - 1] || '';
		arr.pop();
		return [arr.join('.'), `.${suffix}`];
	}
	return [v, ''];
}

export const RULES: Rule[] = [
	{
		ruleName: '保留整数',
		rule: (val: number) => {
			if (val) return val.toFixed(0);
			return val;
		},
	},
	{
		ruleName: '保留一位小数',
		rule: (val: number) => {
			if (val) return val.toFixed(1);
			return val;
		},
	},
	{
		ruleName: '保留两位小数',
		rule: (val: number) => {
			if (val) return val.toFixed(2);
			return val;
		},
	},
	{
		ruleName: '保留两位小数（千分位表示）',
		rule: (val: number) => {
			if (val)
				return val.toLocaleString(void 0, {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				});
			return val;
		},
	},
	{
		ruleName: '日期：2023/03/01',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY/MM/DD');
			return val;
		},
	},
	{
		ruleName: '日期：2023-03-01',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY-MM-DD');
			return val;
		},
	},
	{
		ruleName: '日期：2023/03/01 13:30',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY/MM/DD HH:mm');
			return val;
		},
	},
	{
		ruleName: '日期：2023-03-01 13:30',
		rule: (val: string) => {
			if (val) return dayjs(val)?.format('YYYY-MM-DD HH:mm');
			return val;
		},
	},
];

export function isNotVoidObj(obj: Record<string, any>): boolean {
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		if (obj[keys[i]] !== void 0) return true;
	}
	return false;
}

export function void2empty(obj: Record<string, any>): Record<string, any> {
	Object.keys(obj).forEach((key) => {
		if (obj[key] === void 0) {
			obj[key] = '';
		}
	});
	return obj;
}

export function checkIn(obj: HTMLElement, mouse: MouseEvent): boolean {
	const x = mouse.clientX; // 鼠标相对屏幕横坐标
	const y = mouse.clientY; // 鼠标相对屏幕纵坐标
	const divX = Number(obj.getBoundingClientRect().left); // obj相对屏幕的横坐标
	const divXWidth = Number(obj.getBoundingClientRect().left + obj.clientWidth); // obj相对屏幕的横坐标+width

	const divY = Number(obj.getBoundingClientRect().top); // obj相对屏幕的纵坐标
	const divYHeight = Number(obj.getBoundingClientRect().top + obj.clientHeight); // obj相对屏幕的纵坐标+height
	console.log(x, y, divX, divY, divXWidth, divYHeight);
	return x > divX && x < divXWidth && y > divY && y < divYHeight;
}
