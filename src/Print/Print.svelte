<script>
    import Header from './Head.svelte'
    import Total from './Total.svelte'
    import Program from './Content.svelte'
</script>

<div class="container">
    <div class="flex-item">
        <Header />
    </div>
    <div class="flex-item">
        <Total />
    </div>
    <div class="flex-item">
        <Program />
    </div>
</div>

<style>
    .flex-item{
        margin-bottom: 0.5cm;
    }
</style>