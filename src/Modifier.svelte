<script>
</script>

<div class="modifier" on:click>
    <div class="header">
        <slot name="header" />
    </div>
    <div class="body">
        <slot name="body" />
    </div>
    <div class="footer">
        <slot name="footer" />
    </div>

</div>

<style>
    .modifier{
        margin: 5px 5px;
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid blue;
        border-radius: .25rem;
    }

    .header {
        padding: 5px;
        background-color: rgba(0, 0, 0, .03);
        border-top: 1px solid rgba(0, 0, 0, .125);
    }

    .body {
        font-weight: bolder;
        flex: 1 1 auto;
        min-height: 1px;
        padding: 5px;
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(0, 0, 0, .03);
        border-top: 1px solid rgba(0, 0, 0, .125);
        padding: 5px;
    }
</style>
