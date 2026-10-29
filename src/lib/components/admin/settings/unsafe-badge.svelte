<script lang="ts">
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Badge } from '#lib/components/ui/badge/index.js';
</script>

<Badge variant="outline" class="border-amber-500/40 text-amber-600 dark:text-amber-400">
	<TriangleAlertIcon />
	Unsafe
</Badge>
