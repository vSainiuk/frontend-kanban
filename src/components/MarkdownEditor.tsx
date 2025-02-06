'use client'

import { axiosWithAuth } from '@/api/interceptors'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'
import '@toast-ui/editor/dist/toastui-editor.css'

import { Editor } from '@toast-ui/react-editor'
import debounce from 'lodash.debounce'
import { useCallback, useRef } from 'react'

interface MarkdownEditorProps {
	title: string
	description?: string
	setDescription: (description: string) => void
	isCompletedTask?: boolean
}

export default function MarkdownEditor({
	title,
	description,
	setDescription,
	isCompletedTask,
}: MarkdownEditorProps) {
	const editorRef = useRef<Editor | null>(null)

	const debouncedContentChange = useCallback(
		debounce((markdown: string) => {
			setDescription(markdown)
		}, 500),
		[]
	)

	const handleContentChange = () => {
		if (isCompletedTask) return

		const editorInstance = editorRef.current?.getInstance()
		const markdown = editorInstance.getMarkdown()
		debouncedContentChange(markdown)
	}

	const handleImageUpload = async (
		blob: File,
		callback: (url: string, altText?: string) => void
	) => {
		try {
			const formData = new FormData()
			formData.append('file', blob)

			const response = await axiosWithAuth.post('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			if (response.data.url) {
				callback(response.data.url, blob.name)
			}
		} catch (error) {
			console.error('Image upload failed:', error)
		}
	}

	return (
		<div className='z-50' data-no-dnd>
			<Editor
				ref={editorRef}
				height='500px'
				theme='dark'
				initialEditType={'wysiwyg'}
				previewStyle='vertical'
				initialValue={description ? description : title}
				value={description ? description : title}
				placeholder='Write something...'
				onChange={isCompletedTask ? undefined : handleContentChange}
				usageStatistics={false}
				hooks={
					isCompletedTask ? undefined : { addImageBlobHook: handleImageUpload }
				}
			/>
		</div>
	)
}
