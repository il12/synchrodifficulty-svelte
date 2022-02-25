<script>
    import {onMount, onDestroy, setContext} from 'svelte'
    import {get} from 'svelte/store'
    import {modalStates, fragmentState, routineState} from './stores'
    import {showModifierModal, hideEditFragmentModal} from './modals_visibility';
    import {
        calculateFragmentBasicMark,
        calculateFragmentDifficulty,
        calculateRoutineDifficulty,
        calculateRoutineTime,
        calculateHybridLevel,
        calculateFragmentDuration,
        calculateHybridTime,
        excludeNonUniqueModifiers
    } from './calculations'
    import Modal from './Modal.svelte'
    import Modifier from './Modifier.svelte'

    let autoModifiers
    let fragmentModalVisibility
    let modifierModalVisibility;
    let inputType;
    let inputStartTime;
    let inputEndTime;
    let inputMovements;
    let inputLegs;
    let inputDirection;
    let inputSupport;
    let inputRotations;
    let interval;
    export let fragment = {};
    export let index;
    let routineUniqueModifiers;

    fragmentState.set(fragment);

    onMount(async () => {
        let data = await fetch('./modifiers.json').then(res => res.json());
        autoModifiers = data.filter(item => {
            return item.category === 'Auto' && item.type === fragment.type
        });
        routineUniqueModifiers = await fetch('./routine_unique_modifiers.json').then(res => res.json());
        interval = setInterval(checkAutoModifiers,10);
    })

    let modals = modalStates.subscribe(state => {
        fragmentModalVisibility = state.fragmentModalVisibility;
        modifierModalVisibility = state.modifierModalVisibility;
    })

    const saveFragment = function () {
        let fragment = Object.assign({}, get(fragmentState));
        let program = Object.assign({}, get(routineState));
        fragment.duration = calculateFragmentDuration(fragment);
        if (fragment.type === 'hybrid') {
            fragment.level = calculateHybridLevel(fragment)
            let level = fragment.level === "long" ? 3 : (fragment.level === "medium" ? 2 : 1)
            let finalHybrid = routineUniqueModifiers[level];
            $routineState.unique_modifiers = [finalHybrid];
            console.log($routineState);
        }
        fragment.basicMark = calculateFragmentBasicMark(fragment)
        fragment.difficulty = calculateFragmentDifficulty(fragment, program.type);
        fragment.modifiers = excludeNonUniqueModifiers(fragment);
        $routineState.fragments = [...$routineState.fragments.slice(0, index), Object.assign({}, fragment), ...$routineState.fragments.slice(index + 1)];
        $routineState.fragments = $routineState.fragments.sort((a, b) => a.startTime < b.startTime ? -1 : 1)
        $routineState.duration = calculateRoutineTime($routineState)
        let {hybridsTime, hybridsPercent, hybridsScore} = calculateHybridTime($routineState)
        $routineState.hybridsTime = hybridsTime;
        $routineState.hybridsPercent = String(Math.round(hybridsPercent * 100))+"%";
        $routineState.hybridsScore = hybridsScore.toFixed(2);
        $routineState.mark = calculateRoutineDifficulty($routineState)
        clearInterval(interval);
        hideEditFragmentModal();
    }
    const addModifier = function () {
        if ((inputType && inputType.reportValidity()) &&
                (inputStartTime && inputStartTime.reportValidity()) &&
                (inputEndTime && inputEndTime.reportValidity()) &&
                (!inputMovements || inputMovements.reportValidity()) &&
                (!inputLegs || inputLegs.reportValidity()) &&
                (!inputDirection || inputDirection.reportValidity()) &&
                (!inputSupport || inputSupport.reportValidity()) &&
                (!inputRotations || inputRotations.reportValidity())
        ) {
            showModifierModal()
        }
    }

    const checkAutoModifiers = function () {
        if ($fragmentState.type === 'hybrid') {
            let level = calculateHybridLevel($fragmentState);

            $fragmentState.modifiers = $fragmentState.modifiers.filter(modifier => modifier.category !== 'Auto')

            if($fragmentState.numberOfMovements === ">30"){
                $fragmentState.modifiers = [...$fragmentState.modifiers, autoModifiers[0]];
            }
        }
    }

    const removeModifier = function (modifier) {
        let index = $fragmentState.modifiers.findIndex(el => el === modifier);
        $fragmentState.modifiers = [...$fragmentState.modifiers.slice(0, index), ...$fragmentState.modifiers.slice(index + 1)]
    }

    const dismissFragment = function(){
        clearInterval(interval);
        hideEditFragmentModal();
    }
</script>

<Modal on:close="{hideEditFragmentModal}" z_index=1>
    <div slot="header">
        <div class="col">
            <h2>Edit Fragment №{index+1}</h2>
        </div>
    </div>
    <div slot="body" class="container">
        <div class="form">
            <label>Type
                <select disabled required bind:this={inputType} bind:value={$fragmentState.type}
                        class="custom-select">
                    <option value="hybrid">Hybrid</option>
                    <option value="transition">Transition</option>
                </select>
            </label>
            <div style="display: flex; flex-direction: row">
                <label for="startTime">Start time</label>
                <input id="startTime" required bind:this={inputStartTime} bind:value={$fragmentState.startTime}
                       pattern="[0-9]:[0-9][0-9]" placeholder="0:00"
                       class="form-control">
                <label for="endTime">End time</label>
                <input id="endTime" required bind:this={inputEndTime} bind:value={$fragmentState.endTime}
                       pattern="[0-9]:[0-9][0-9]" placeholder="0:00"
                       class="form-control">
            </div>
            {#if $fragmentState.type === "pair acrobatics"}
                <label>Direction
                    <select required bind:this={inputDirection} bind:value={$fragmentState.direction}
                            class="custom-select">
                        <option disabled value>Choose...</option>
                        <option value="{0.1}">Heads up</option>
                        <option value="{0.2}">Legs up</option>
                    </select>
                </label>

                <label>Support type
                    <select required bind:this={inputSupport} bind:value={$fragmentState.support} class="custom-select">
                        <option disabled value>Choose...</option>
                        <option value="{0}">Lift</option>
                        <option value="{0.1}">Throw</option>
                    </select>
                </label>

                <label>360° Rotations
                    <input required bind:this={inputRotations} bind:value={$fragmentState.rotations} type="number"
                           min="0"
                           class="form-control">
                </label>
            {/if}
            {#if $fragmentState.type === "hybrid"}
                <label>Number of Movements
                    <select required bind:this={inputMovements} bind:value={$fragmentState.numberOfMovements}
                            class="custom-select">
                        <option selected disabled value>Choose...</option>
                        <option value="<6">&lt;6</option>
                        <option value="6-20">6-20</option>
                        <option value="21-30">21-30</option>
                        <option value=">30"> &gt;30 </option>
                    </select>
                </label>
                <label>Legs
                    <select required bind:this={inputLegs} bind:value={$fragmentState.legs} class="custom-select">
                        <option disabled value>Choose...</option>
                        <option value="1">One leg (raising or lifting)</option>
                        <option value="2">Two legs (raising or lifting)</option>
                    </select>
                </label>
            {/if}
            <button on:click="{addModifier}" class="btn btn-outline-primary">Add additional movement</button>
        </div>
        <div class="modifiers">
            {#each $fragmentState.modifiers as modifier}
                <Modifier>
                    <div slot="header">
                        {modifier["category"]}
                    </div>
                    <div slot="body">
                        {modifier.name}
                    </div>
                    <div slot="footer">
                        Score: {modifier["values"][$routineState.type]}
                    </div>
                    <div class="close-button" slot="footer" on:click={()=>removeModifier(modifier)}>
                        &times;
                    </div>
                </Modifier>
            {:else}
                <div>
                    Additional movements will be here.
                </div>
            {/each}
        </div>
    </div>
    <div slot="footer" class="footer">
        <button on:click="{saveFragment}" class="btn btn-primary">Confirm</button>
        <button on:click="{dismissFragment}" class="btn btn-danger">Dismiss</button>
    </div>
</Modal>


<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    button {
        display: block;
        margin-left: 5px;
        margin-right: 5px;
    }

    .modifiers {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(4, 1fr);
    }
</style>
