<script lang="ts">
  interface Props {
    headers: string[];
    rows: (string | number)[][];
    caption?: string;
    sortable?: boolean;
    striped?: boolean;
    align?: ('left' | 'right' | 'center')[];
  }

  let {
    headers,
    rows,
    caption,
    sortable = true,
    striped = false,
    align,
  }: Props = $props();

  let sortCol = $state<number | null>(null);
  let sortDir = $state<'asc' | 'desc'>('asc');

  function handleSort(i: number) {
    if (!sortable) return;
    if (sortCol === i) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortCol = i;
      sortDir = 'asc';
    }
  }

  let sorted = $derived.by(() => {
    if (sortCol === null) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sortCol!];
      const bv = b[sortCol!];
      const an = Number(av);
      const bn = Number(bv);
      const cmp = !isNaN(an) && !isNaN(bn)
        ? an - bn
        : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  });

  function colAlign(i: number): string {
    return align?.[i] ?? 'left';
  }
  let sortAnnouncement = $derived(
    sortCol !== null
      ? `Sorted by ${headers[sortCol]}, ${sortDir === 'asc' ? 'ascending' : 'descending'}`
      : ''
  );
</script>

<div class="datatable-wrap">
  <div aria-live="polite" aria-atomic="true" class="sr-only">{sortAnnouncement}</div>
  <div class="datatable-scroll">
    <table class="datatable" class:striped>
      {#if caption}
        <caption>{caption}</caption>
      {/if}

      <thead>
        <tr>
          {#each headers as header, i}
            <th
              scope="col"
              style="text-align: {colAlign(i)}"
              class:sortable
              class:sorted={sortCol === i}
              onclick={() => handleSort(i)}
              onkeydown={(e) => e.key === 'Enter' && handleSort(i)}
              tabindex={sortable ? 0 : undefined}
              aria-sort={
                sortCol === i
                  ? sortDir === 'asc' ? 'ascending' : 'descending'
                  : sortable ? 'none' : undefined
              }
            >
              <span class="th-inner">
                {header}
                {#if sortable}
                  <span class="sort-icon" aria-hidden="true">
                    {sortCol === i
                      ? (sortDir === 'asc' ? '↑' : '↓')
                      : '↕'}
                  </span>
                {/if}
              </span>
            </th>
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each sorted as row, ri}
          <tr class:alt={striped && ri % 2 === 1}>
            {#each row as cell, ci}
              <td style="text-align: {colAlign(ci)}">{cell}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .datatable-wrap {
    margin: 1.5em 0;
    font-family: var(--font-sans);
  }

  .datatable-scroll {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .datatable {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875em;
    background: var(--entry);
    min-width: 400px;
  }

  caption {
    caption-side: bottom;
    text-align: center;
    font-size: 0.8em;
    color: var(--secondary);
    padding: 0.5em 0.25em;
    font-style: italic;
  }

  thead {
    background: color-mix(in srgb, var(--accent) 10%, var(--entry));
  }

  th {
    padding: 0.65em 1em;
    font-size: 0.78em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary);
    border-bottom: 2px solid color-mix(in srgb, var(--accent) 25%, var(--border));
    white-space: nowrap;
    user-select: none;
  }

  th.sortable {
    cursor: pointer;
  }

  th.sortable:hover {
    background: color-mix(in srgb, var(--accent) 16%, var(--entry));
    color: var(--primary);
  }

  th.sorted {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, var(--entry));
  }

  .th-inner {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
  }

  .sort-icon {
    font-size: 0.85em;
    opacity: 0.55;
  }

  th.sorted .sort-icon {
    opacity: 1;
    color: var(--accent);
  }

  td {
    padding: 0.6em 1em;
    color: var(--content);
    border-bottom: 1px solid var(--border);
    line-height: 1.5;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: color-mix(in srgb, var(--accent) 5%, var(--entry));
  }

  .datatable.striped .alt td {
    background: color-mix(in srgb, var(--accent) 3%, var(--entry));
  }
  .datatable.striped .alt:hover td {
    background: color-mix(in srgb, var(--accent) 7%, var(--entry));
  }
</style>
