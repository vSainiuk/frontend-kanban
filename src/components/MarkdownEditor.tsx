import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import { Editor } from '@toast-ui/react-editor'
import { useRef, useState } from 'react'
import { Button } from './ui/button'

export default function MarkdownEditor({
	title
}: { title: string }) {
	const editorRef = useRef<Editor | null>(null)
	const [content, setContent] = useState<string>('')

	console.log('content', content)

	const handleContentChange = () => {
		const editorInstance = editorRef.current?.getInstance()
		const markdown = editorInstance.getMarkdown()
		setContent(markdown)
	}

	const handleSave = () => {
		console.log('Saved Content:', content)
	}

	return (
		<div className='pointer-events-auto z-50'>
			<Editor
				ref={editorRef}
				height='500px'
				theme='dark'
				initialEditType='wysiwyg'
				previewStyle='vertical'
				initialValue={title}
				placeholder='А чо писати то...'
				onChange={handleContentChange}
			/>
			<Button onClick={handleSave} style={{ marginTop: '10px' }}>
				Save Content
			</Button>
		</div>
	)
}
