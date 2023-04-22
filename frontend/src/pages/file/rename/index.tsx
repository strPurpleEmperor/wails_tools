// @ts-nocheck

import './index.css';
// import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, notification, Space, Modal, UploadProps, Upload } from 'antd';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
// import { dialog, fs } from '@tauri-apps/api';
import { EventsOn } from '@wailsapp/runtime';
import { fileNameVal, renameVal } from '../../../atom/file/rename';
import { getFileType, openDirectory } from '../../../tools';
import { ReadDirByPath, RenameFile } from '../../../../wailsjs/go/main/App';

const colorMap = ['', '#52c41a', '#ff4d4f'];
function Rename() {
	const [files, setFiles] = useAtom(fileNameVal);
	const [rename, setRename] = useAtom(renameVal);
	function readDir(dir: string) {
		if (!dir) return;
		readFiles(dir);
	}
	function readFiles(dir: string) {
		ReadDirByPath(dir).then((res) => {
			console.log(res);
			let _renames = '';
			const _files: any[] = [];
			res.forEach((r) => {
				const [oName, type] = getFileType(r);
				_files.push({
					name: oName,
					path: `${dir}/${r}`,
					type,
				});
				if (_renames) _renames += '\n';
				_renames += oName;
			});
			setRename(_renames);
			setFiles(_files);
		});
	}
	useEffect(() => {
		const renameList = rename.split('\n');
		if (renameList.length > 0) {
			const fList = [...files];
			renameList.forEach((r, i) => {
				if (fList[i]) {
					fList[i].rename = r;
				}
			});
			setFiles(fList);
		}
	}, [rename]);
	function clearWork() {
		setFiles([]);
		setRename('');
	}
	function toRename() {
		const renames = rename.split('\n');
		if (files.length !== renames.length) return message.error('两边数量不相等');
		const value: any[] = [];
		files.forEach((f, index) => {
			value.push({
				path: f.path,
				newPath: f.path.replace(`${f.name}${f.type}`, `${renames[index]}${f.type}`),
				newName: renames[index],
			});
		});
		const pl: Promise<any>[] = [];
		let successCount = 0;
		value.forEach((v, index) => {
			pl.push(
				RenameFile(v.path, v.newPath)
					.then(() => {
						successCount++;
						files[index].status = 1;
						files[index].name = v.newName;
						files[index].path = v.newPath;
					})
					.catch((e) => {
						console.log(e);
					})
			);
		});
		Promise.all(pl).then(() => {
			setFiles([...files]);
			notification.info({
				message: (
					<div>
						<h4>操作结果：</h4>
						<p style={{ color: '#52c41a' }}>成功{successCount}个</p>
						<p style={{ color: '#ff4d4f' }}>失败{value.length - successCount}个</p>
					</div>
				),
			});
		});
	}
	return (
		<div className="rename">
			<Button
				style={{ width: '100%', height: 160 }}
				onClick={() => {
					openDirectory().then((res) => {
						readDir(res);
					});
				}}
			>
				<div style={{ padding: 0, fontSize: 45, color: '#1677ff' }}>
					<InboxOutlined />
				</div>
				<div style={{ fontSize: 18 }}>单击上传文件</div>
				<p />
			</Button>
			<Space style={{ marginTop: 10, marginBottom: 10 }}>
				<Button onClick={clearWork}>清空</Button>
				<Button disabled={!rename} type="primary" onClick={toRename}>
					重命名
				</Button>
			</Space>
			<div style={{ display: 'flex' }}>
				<Card size="small" title="名称" style={{ flex: 1 }}>
					<div style={{ paddingLeft: 11, paddingTop: 4, paddingRight: 11 }}>
						{files.map((f, index) => (
							<div key={`${index + Math.random()}`}>
								<div style={{ color: colorMap[f.status] }}>{f.name}</div>
							</div>
						))}
					</div>
				</Card>
				<Card size="small" title="修改名称" style={{ flex: 1 }}>
					<Input.TextArea value={rename} maxLength={-1} autoSize onInput={(e: any) => setRename(e.target.value)} />
				</Card>
			</div>
		</div>
	);
}
export default Rename;
