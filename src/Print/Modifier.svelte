<script>
    import {routineState} from "../stores"

    export let modifier
</script>

<tr>
    <td colspan="2" class="border">{modifier.category}</td>
    <td colspan="2" class="border">{modifier.name}</td>
    <td class="border">{modifier.values[$routineState.type]}</td>
    <td class="border"></td>
    <td class="border"></td>
    <td class="border"></td>
</tr>

<style>
    .border {
        border: 1px solid black;
    }
</style>