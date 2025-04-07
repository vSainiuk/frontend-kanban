
import KanbanViewPage from '../KanbanViewPage'

export default async function TasksPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const boardSlug = Array.isArray(slug) ? slug[0] : slug

	return (
		<KanbanViewPage boardSlug={boardSlug} />
	)
}
