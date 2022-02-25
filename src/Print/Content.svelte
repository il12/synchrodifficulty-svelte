<script>
    import {get} from 'svelte/store'
    import {routineState} from "../stores"
    import Fragment from "./Fragment.svelte"

    let program = Object.assign({}, get(routineState));
    console.log(program);
</script>

<table class="collapse w-17 m-default">
    <thead>
    <tr>
        <th class="w-1 border">Start</th>
        <th class="w-1 border">End</th>
        <th class="w-2 border">Duration</th>
        <th class="w-5 border">Description</th>
        <th class="w-1 border">MARK</th>
        <th colspan="3" class="w-3 border">Expert</th>
    </tr>
    </thead>
    {#each $routineState.fragments as fragment}
        <Fragment fragment={fragment}/>
    {/each}
</table>

<style>
    .border {
        border: 1px solid black;
    }

    .w-1 {
        width: 1.5cm;
    }

    .w-2 {
        width: 2.5cm;
    }

    .w-5 {
        width: 5cm;
    }

    .w-17 {
        width: 17cm;
    }

    .collapse {
        border-collapse: collapse;
        word-break: break-all
    }
</style>