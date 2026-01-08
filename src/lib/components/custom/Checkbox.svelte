<script lang="ts">
	import { Check } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		class: className,
		name,
		value,
		disabled = false,
		required = false,
		...restProps
	}: {
		ref?: HTMLInputElement | null;
		checked?: boolean;
		class?: string;
		name?: string;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<label
	data-slot="checkbox"
	class={cn(
		'relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	<input
		bind:this={ref}
		type="checkbox"
		bind:checked
		{name}
		{value}
		{disabled}
		{required}
		class="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-[4px] border border-input bg-background shadow-xs outline-none transition-shadow checked:border-primary checked:bg-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
		{...restProps}
	/>
	<Check
		class="pointer-events-none absolute z-10 hidden size-3 text-white peer-checked:block"
		strokeWidth={3}
		aria-hidden="true"
	/>
</label>
