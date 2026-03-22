<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: Snippet;
  } = $props();

  // Determine the correct base URL depending on environment
  // In Vite dev, it's just /DeveloperHelpTool/ (from config.base)
  // In production it will be the same.
  const baseUrl = import.meta.env.BASE_URL;
</script>

<svelte:head>
  <title>{title}</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="container mt-4 mb-5">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <a href="{baseUrl}">Home</a>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{title}</li>
    </ol>
  </nav>

  <h1 class="mb-3">{title}</h1>

  {#if description}
    <p class="text-secondary">{description}</p>
  {/if}

  <div class="mt-4">
    {@render children()}
  </div>
</div>
