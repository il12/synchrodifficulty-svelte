<script>
    import {modalStates, routineState, fragmentState} from './stores'
    import {get} from 'svelte/store'
    import {onMount, onDestroy} from 'svelte'
    import Modal from "./Modal.svelte";
    import {hideModifierModal} from './modals_visibility'
    import Modifier from "./Modifier.svelte";

    let fragmentModalVisibility;
    let modifierModalVisibility;
    let modifiers = [];

    onMount(async () => {
        let program = get(routineState);
        let data = await fetch('./modifiers.json').then(res => res.json());
        modifiers = data.filter(item => {
            return item.type === $fragmentState.type && item["values"][program.type] !== null && item.category !== 'Auto'
        });
    })

    let modals = modalStates.subscribe(state => {
        fragmentModalVisibility = state.fragmentModalVisibility;
        modifierModalVisibility = state.modifierModalVisibility;
    })

    const addModifier = function (modifier) {
        $fragmentState.modifiers = [...$fragmentState.modifiers, modifier];
        hideModifierModal();
    }
    /*
*/
</script>


<Modal on:close="{hideModifierModal}" z_index=2>
    <div slot="header">
        <div>
            New Modifier
        </div>
    </div>
    <div slot="body" class="modifiers-table">
        {#each modifiers as modifier}
            <Modifier on:click={()=>addModifier(modifier)}>
                <div slot="header" class="modifier-header">
                    {modifier["category"]}
                </div>
                <div slot="body" class="modifier-body">
                    {modifier.name}
                </div>
                <div slot="footer" class="modifier-footer">
                        Score: {modifier["values"][$routineState.type]}
                </div>
            </Modifier>
        {:else}
            Loading...
        {/each}
    </div>
    <div slot="footer">
        <button on:click="{hideModifierModal}" class="btn btn-danger">Dismiss</button>
    </div>
</Modal>

<style>
    .modifiers-table {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }

    .modifier-header {
        padding: 5px;
        background-color: rgba(0, 0, 0, .03);
        border-top: 1px solid rgba(0, 0, 0, .125);
    }

    .modifier-body {
        font-weight: bolder;
        flex: 1 1 auto;
        min-height: 1px;
        padding: 5px;
    }

    .modifier-footer {
        padding: 5px;
        background-color: rgba(0, 0, 0, .03);
        border-top: 1px solid rgba(0, 0, 0, .125);
    }
</style>