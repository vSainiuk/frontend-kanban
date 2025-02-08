'use client'

import { saveImageToS3 } from '@/utils/sendImageToS3'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'
import '@toast-ui/editor/dist/toastui-editor.css'

import { Editor } from '@toast-ui/react-editor'
import debounce from 'lodash.debounce'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

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
			const response = await saveImageToS3(blob)

			if (response.data.url) {
				callback(response.data.url, blob.name)
			}
		} catch (error) {
			toast.error('Failed to upload image. Please send an image.')
		}
	}

	return (
		<div className='z-50'>
			<Editor
				ref={editorRef}
				height='500px'
				theme='dark'
				initialEditType={'wysiwyg'}
				previewStyle='vertical'
				initialValue={description ? description : title ? title : ' '}
				value={description ? description : title ? title : ' '}
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
