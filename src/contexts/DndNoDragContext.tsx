import { createContext, useContext, useState } from 'react'

interface DndNoDragContextType {
	disabledDrag: boolean
	setDisabledDrag: (value: boolean) => void
}

const DndNoDragContext = createContext<DndNoDragContextType | undefined>(
	undefined
)

export const DndNoDragProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [disabledDrag, setDisabledDrag] = useState(false)

	return (
		<DndNoDragContext.Provider value={{ disabledDrag, setDisabledDrag }}>
			{children}
		</DndNoDragContext.Provider>
	)
}

export const useDndNoDragContext = () => {
	const context = useContext(DndNoDragContext)
	if (!context) {
		throw new Error(
			'useDndNoDragContext must be used within a DndNoDragProvider'
		)
	}
	return context
}
