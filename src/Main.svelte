<script>
    import {onMount} from 'svelte'
    import {modalStates, routineState} from './stores';
    import {calculateRoutineDifficulty,calculateRoutineTime} from './calculations'
    import {showFragmentModal, showEditFragmentModal} from './modals_visibility';
    import FragmentModal from "./FragmentModal.svelte";
    import ModifierModal from "./ModifiersModal.svelte";
    import EditFragmentModal from "./EditFragmentModal.svelte"
    import Fragment from './Fragment.svelte'

    let fragmentModalVisibility
    let modifierModalVisibility;
    let editFragmentModalVisibility;
    let inputHighDiffPatternModifier;
    let routineUniqueModifiers;
    let editingFragment;
    let editingFragmentIndex;

    let inputFile;
    let inputName;
    let inputType;
    let inputCountry;
    let inputCompetition;
    let inputDate;

    onMount(async () => {
        routineUniqueModifiers = await fetch('./routine_unique_modifiers.json').then(res => res.json());
    })

    let modals = modalStates.subscribe(state => {
        fragmentModalVisibility = state.fragmentModalVisibility;
        modifierModalVisibility = state.modifierModalVisibility;
        editFragmentModalVisibility = state.editFragmentModalVisibility;
    })

    let printForm = function () {
        if (inputName.reportValidity() && inputType.reportValidity() && inputCountry.reportValidity() && inputCompetition.reportValidity() && inputDate.reportValidity()) {
            window.print()
        }
    }

    let editHighDiffPatternModifier = function () {
        console.log($routineState);
        if (inputHighDiffPatternModifier.checked) {
            $routineState.unique_modifiers = [routineUniqueModifiers[0]]
        } else {
            $routineState.unique_modifiers = []
        }
        $routineState.mark = calculateRoutineDifficulty($routineState);
    }


    let removeFragment = function (index) {
        $routineState.fragments = [...$routineState.fragments.slice(0, index), ...$routineState.fragments.slice(index + 1)]
        $routineState.mark = calculateRoutineDifficulty($routineState);
        $routineState.duration = calculateRoutineTime($routineState)
    }

    let editFragment = function (fragment, index) {
        editingFragment = fragment;
        editingFragmentIndex = index;
        showEditFragmentModal();
    }

    let saveDataset = function () {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($routineState));
        let dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `${$routineState.type}_${$routineState.country}_${$routineState.name}.asd`);
        dlAnchorElem.click();
    }

    let loadFile = function () {
        let reader = new FileReader();
        let data;
        reader.addEventListener('load', (event) => {
            data = event.target.result;
            routineState.set(JSON.parse(data));
        });
        reader.readAsText(inputFile.files[0]);
    }
</script>

<div class="container">
    <div class="row">
        <label>Routine
            <select bind:this={inputType} bind:value={$routineState.type} class="custom-select" required>
                <option disabled value>Choose...</option>
                <option value="solo">Solo</option>
                <option value="duet">Duet</option>
                <option value="team">Team</option>
            </select>
        </label>
        <div>Load .asd file
            <div>
                <button on:click={()=>inputFile.click()} style="width: 100%" class="btn btn-outline-primary">
                    Press here to select .asd file from your computer
                </button>
            </div>
        </div>
        <input bind:this={inputFile} on:change={loadFile} type="file" accept=".asd"
               hidden>
    </div>
    <div class="row">
        <label>Country
            <input bind:this={inputCountry} bind:value={$routineState.country} class="form-control" type="text"
                   required>
        </label>
        <label>Name of the athlete or team
            <input bind:this={inputName} bind:value={$routineState.name} class="form-control" type="text" required>
        </label>
    </div>

    <div class="row">
        <label>Name of the competition
            <input bind:this={inputCompetition} bind:value={$routineState.competition} class="form-control" type="text"
                   required>
        </label>
        <label>Date
            <input bind:this={inputDate} bind:value={$routineState.date} class="form-control" type="date" required>
        </label>
    </div>
    <div class="row">
        <div>
            <label>Duration
                <input bind:value={$routineState.duration} class="form-control" disabled type="text">
            </label>
        </div>
        <div>
            <label>Difficulty
                <input bind:value={$routineState.mark} class="form-control" disabled type="text">
            </label>
        </div>
    </div>
    {#if $routineState.type}
        <div class="row">
            <button on:click={saveDataset} class="btn btn-outline-primary">Press here to get .asd file</button>
            <button on:click={printForm} class="btn btn-outline-primary ">Press here to print report</button>
        </div>
        <div class="row-flex">
            <button on:click="{showFragmentModal}" class="btn btn-primary">Press here to add new
                part of the routine
            </button>
        </div>
    {/if}
    {#if $routineState.type === "team"}
        <div>
            <div class="form-check">
                <input bind:this={inputHighDiffPatternModifier} on:change={editHighDiffPatternModifier} id="team-unique"
                       type="checkbox" class="form-check-input">
                <label for="team-unique" class="form-check-label">Hight level difficulty pattern
                    changes
                    (moving patterns, passing through patterns, close spaced, quick and sharp
                    surface changes)
                </label>
            </div>
        </div>
    {/if}
    <div class='fragments'>
        {#each $routineState.fragments as fragment,id}
            <Fragment on:click={()=>editFragment(fragment,id)}>
                <div slot="header">
                    №{id+1}
                </div>
                <div slot="header">
                    {fragment.duration} sec.
                </div>
                <div slot="body">
                    {fragment.type}
                </div>
                <div slot="body">
                    {fragment.startTime} - {fragment.endTime}
                </div>
                <div slot="footer">
                    Diff.: {fragment.difficulty}
                </div>
                <div class="close-button" slot="footer" on:click={(event)=>{event.stopPropagation(); removeFragment(id)}}>
                    &times;
                </div>
            </Fragment>
        {/each}
    </div>
</div>

{#if fragmentModalVisibility}
    <FragmentModal/>
{/if}
{#if modifierModalVisibility}
    <ModifierModal/>
{/if}
{#if editFragmentModalVisibility}
    <EditFragmentModal fragment={editingFragment} index={editingFragmentIndex}/>
{/if}

<a id="downloadAnchorElem" style="display:none">&nbsp</a>

<style>
    .close-button {
        cursor: pointer;
    }

    input:disabled {
        color: black;
        background-color: deepskyblue;
        font-weight: 800;
    }

    div {
        text-transform: inherit;
        text-align: inherit;
        font-weight: inherit;
    }

    .container {
        width: 40%;
        margin-right: auto;
        margin-left: auto;
    }

    .fragments {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);
    }

    .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 10px;
    }

    .row-flex {
        display: flex;
        flex-direction: column;
    }
</style>