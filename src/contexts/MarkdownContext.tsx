import { createContext, useContext, useState } from 'react'

interface MarkdownContextType {
	isMarkdownOpen: boolean
	setIsMarkdownOpen: (value: boolean) => void
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(
	undefined
)

export const MarkdownProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [isMarkdownOpen, setIsMarkdownOpen] = useState(false)

	return (
		<MarkdownContext.Provider value={{ isMarkdownOpen, setIsMarkdownOpen }}>
			{children}
		</MarkdownContext.Provider>
	)
}

export const useMarkdownContext = () => {
	const context = useContext(MarkdownContext)
	if (!context) {
		throw new Error('useMarkdownContext must be used within a MarkdownProvider')
	}
	return context
}
