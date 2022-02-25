<script>
    import {routineState} from "../stores"
</script>

<table class="collapse w-17">
    <thead>
    <tr>
        <th colspan="5" style="width: 17cm; border: 1px solid black">ARTISTIC SWIMMING DIFFICULTY FORM</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="text-left w-3">EVENT:</td>
        <td class="border text-left w-1 text-bold uppercase">{$routineState.type}</td>
        <td class="text-right w-3">PLACE:</td>
        <td class="border text-left w-5 text-bold">{$routineState.competition}</td>
    </tr>
    <tr>
        <td class="text-left w-3">COUNTRY:</td>
        <td class="border text-left w-1 text-bold uppercase">{$routineState.country}</td>
        <td class="text-right w-3">DATE:</td>
        <td class="border text-left w-5 text-bold">{$routineState.date}</td>
    </tr>
    <tr>
        <td class="text-left w-3">NAME:</td>
        <td class="border text-left w-5 text-bold">{$routineState.name}</td>
        <td class="text-right w-3">Start List №</td>
        <td class="border text-left w-5 text-bold"></td>
    </tr>
    </tbody>
</table>

<style>
    .uppercase{
        text-transform: uppercase;
    }

    .text-right {
        text-align: right;
    }

    .text-bold {
        font-weight: bold;
    }

    .border {
        border: 1px solid black;
    }

    .w-1 {
        width: 1.5cm;
    }

    .w-3 {
        width: 3cm;
    }

    .w-5 {
        width: 5.5cm;
    }

    .w-17 {
        width: 17cm;
    }

    .collapse{
        border-collapse: collapse;
    }
</style>