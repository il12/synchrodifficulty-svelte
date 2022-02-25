<script>
    import {routineState} from "../stores"
</script>

<table class="w-5 m-default collapse">
    <thead>
    <tr>
        <td class="w-3 border text-bold">TOTAL DIFF:</td>
        <td class="w-3 border text-bold">TOTAL TIME:</td>
        <td class="w-3 border text-bold">HYBRIDS TIME:</td>
        <td class="w-3 border text-bold">HYBRIDS PERCENT:</td>
        <td class="w-3 border text-bold">HYBRIDS SCORE:</td>
    </tr>
    <tr>
        <td class="w-2 border">{$routineState.mark}</td>
        <td class="w-2 border">{$routineState.duration}</td>
        <td class="w-2 border">{$routineState.hybridsTime}</td>
        <td class="w-2 border">{$routineState.hybridsPercent}</td>
        <td class="w-2 border">{$routineState.hybridsScore}</td>
    </tr>
    </thead>
</table>

<style>
    .text-bold {
        font-weight: bold;
    }

    .border {
        border: 1px solid black;
    }

    .w-2 {
        width: 2.5cm;
    }

    .w-3 {
        width: 3cm;
    }

    .w-5 {
        width: 5.5cm;
    }

    .collapse{
        border-collapse: collapse;
    }
</style>