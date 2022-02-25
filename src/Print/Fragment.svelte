<script>
    import Modifier from "./Modifier.svelte"
    export let fragment
</script>

<tr>
    <td class="border shade text-bold">{fragment.startTime}</td>
    <td class="border shade text-bold">{fragment.endTime}</td>
    <td class="border shade text-bold">{fragment.duration} sec.</td>
    <td class="border shade capitalize text-bold">{fragment.type}</td>
    <td class="border shade text-bold">{fragment.difficulty}</td>
    <td class="border"></td>
    <td class="border"></td>
    <td class="border"></td>
</tr>
{#if fragment.type==="hybrid"}
    <tr>
        <td></td>
        <td></td>
        <td class="border capitalize text-bold">Level</td>
        <td class="border capitalize">{fragment.level}</td>
        <td class="border"></td>
        <td class="border"></td>
        <td class="border"></td>
        <td class="border"></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td class="border capitalize text-bold">Movements</td>
        <td class="border capitalize">{fragment.numberOfMovements}</td>
        <td class="border"></td>
        <td class="border"></td>
        <td class="border"></td>
        <td class="border"></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td class="border capitalize text-bold">Basic Mark</td>
        <td class="border capitalize">{fragment.legs} legs</td>
        <td class="border">{fragment.basicMark}</td>
        <td class="border"></td>
        <td class="border"></td>
        <td class="border"></td>
    </tr >
{/if}
{#each fragment.modifiers as modifier}
    <Modifier modifier={modifier} />
{/each}

<style>
    .text-bold{
        font-weight: bold;
    }
    .border {
        border: 1px solid black;
    }
    .capitalize{
        text-transform: capitalize;
    }
    .shade{
        background-color: #c0c0c0;
    }
</style>
