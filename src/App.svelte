<script>
    import Main from "./Main.svelte";
    import Print from "./Print/Print.svelte"
</script>
<div style="font-size: medium; text-align: center; border: 1px red solid">This is an alpha version of Difficulty calculator. It isn't optimized to mobile phones. This software tested primarily in Google Chrome browser. If you find any bugs (mistakes/errors), please, contact the developers by e-mail il5498@yandex.ru</div>
<div class="app">
    <div style="font-size: xx-small">v. 0.5.7</div>
    <Main />
</div>
<div class="print">
    <Print />
</div>

<style>
    @media print {
        .print {
            visibility: visible !important;
            display: block !important;
        }
        :global(table) { page-break-inside:auto }
        :global(tr)    { page-break-inside:avoid; page-break-after:auto }
        :global(thead) { display:table-header-group }
        .app{
            display: none !important;
        }
        html, body{
            width: 210mm;
            height: 297mm;
        }
        *{
            float:none !important;
        }
    }
    .print{
        visibility: hidden;
    }
    .app{
        display: flex;
    }



    :global(.custom-select) {
        display: inline-block;
        width: 100%;
        height: calc(1.5em + .75rem + 2px);
        padding: .375rem 1.75rem .375rem .75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        vertical-align: middle;
        background: #fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    :global(.custom-control-label::before, .custom-file-label, .custom-select){
        transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    :global(.form-control) {
        display: block;
        width: 100%;
        height: calc(1.5em + .75rem + 2px);
        padding: .375rem .75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    :global(.form-check) {
        position: relative;
        display: block;
        padding-left: 1.25rem;
    }
    :global(.form-check-input) {
        position: absolute;
        margin-top: .3rem;
        margin-left: -1.25rem;
    }
    :global(.form-check-label) {
        margin-bottom: 0;
    }
    :global(.btn) {
        display: inline-block;
        font-weight: 400;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: transparent;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    :global(.btn-primary) {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
    }

    :global(.btn-danger) {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;
    }
    :global(.btn-outline-primary) {
        color: #007bff;
        border-color: #007bff;
    }
    :global(.form-control:invalid){
        border-color: #dc3545;
        padding-right: calc(1.5em + 0.75rem);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    :global(.form-control:invalid:focus){
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }


</style>