<script>
    import {onMount, onDestroy, setContext} from 'svelte'
    import {get} from 'svelte/store'
    import {modalStates, fragmentState, routineState} from './stores'
    import {showModifierModal, hideFragmentModal, showFragmentModal} from './modals_visibility';
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

    let autoModifiers;
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
    let routineUniqueModifiers;

    onDestroy(()=>{
        console.log('fragment modal destroyed')
        if($routineState.fragments.length!==0) {
            $fragmentState.startTime = $routineState.fragments[$routineState.fragments.length - 1].endTime;
        } else {
            $fragmentState.startTime = "00:00";
        }
        $fragmentState.endTime = null;
        $fragmentState.numberOfMovements = null;
        $fragmentState.legs = null;
        $fragmentState.basicMark = 0;
        $fragmentState.direction =null;
        $fragmentState.support = null;
        $fragmentState.rotations = null;
        $fragmentState.difficulty = 0;
        $fragmentState.modifiers = [];
    });

    onMount(async () => {
        $fragmentState.type = "";
        if($routineState.fragments.length!==0) {
            $fragmentState.startTime = $routineState.fragments[$routineState.fragments.length - 1].endTime;
        } else {
            $fragmentState.startTime = null;
        }
        $fragmentState.endTime = null;
        $fragmentState.numberOfMovements = null;
        $fragmentState.legs = null;
        $fragmentState.basicMark = 0;
        $fragmentState.direction =null;
        $fragmentState.support = null;
        $fragmentState.rotations = null;
        $fragmentState.difficulty = 0;
        $fragmentState.modifiers = [];
        let data = await fetch('./modifiers.json').then(res => res.json());
        autoModifiers = data.filter(item => {
            console.log(item.category);
            return item.category === 'Auto';
        });
        inputType.addEventListener('change',()=>{
            rerenderModal();
        })
        routineUniqueModifiers = await fetch('./routine_unique_modifiers.json').then(res => res.json());
        interval = setInterval(checkAutoModifiers,10);
    })

    let modals = modalStates.subscribe(state => {
        fragmentModalVisibility = state.fragmentModalVisibility;
        modifierModalVisibility = state.modifierModalVisibility;
    })

    const saveFragment = function () {
        if(inputType.value === ""){
            inputType.setCustomValidity('Please firstly choose type of the part of the routine')
        } else {
            inputType.setCustomValidity("")
        }
        if(
        (inputStartTime && inputStartTime.reportValidity()) &&
        (inputEndTime && inputEndTime.reportValidity())
        ) {
            let fragment = get(fragmentState);
            let program = get(routineState)
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
            $routineState.fragments = [...program.fragments, Object.assign({}, fragment)];
            $routineState.fragments = $routineState.fragments.sort((a, b) => a.startTime < b.startTime ? -1 : 1)
            $routineState.duration = calculateRoutineTime($routineState)
            let {hybridsTime, hybridsPercent, hybridsScore} = calculateHybridTime($routineState)
            $routineState.hybridsTime = hybridsTime;
            $routineState.hybridsPercent = String(Math.round(hybridsPercent * 100))+"%";
            $routineState.hybridsScore = hybridsScore.toFixed(2);
            $routineState.mark = calculateRoutineDifficulty($routineState)
            clearInterval(interval);
            hideFragmentModal();
        }
    }
    const addModifier = function () {
        console.log(inputType.value)
        if(inputType.value === ""){
            inputType.setCustomValidity('Please firstly choose type of the part of the routine')
        } else {
            inputType.setCustomValidity("")
        }
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

    const removeModifier = function (modifier) {
        let index = $fragmentState.modifiers.findIndex(el => el === modifier);
        $fragmentState.modifiers = [...$fragmentState.modifiers.slice(0, index), ...$fragmentState.modifiers.slice(index + 1)]
    }
    const checkAutoModifiers = function () {
        if ($fragmentState.type === 'hybrid') {
            $fragmentState.modifiers = $fragmentState.modifiers.filter(modifier => modifier.category !== 'Auto')

            if($fragmentState.numberOfMovements === ">30"){
                $fragmentState.modifiers = [...$fragmentState.modifiers, autoModifiers[0]];
            }
        }
    }
    const dismissFragment = function(){
        clearInterval(interval);
        hideFragmentModal();
    }
    const rerenderModal = function () {
        inputType.setCustomValidity("")
        $fragmentState.duration = null;
        $fragmentState.numberOfMovements = null
        $fragmentState.legs = null;
        $fragmentState.basicMark = 0;
        $fragmentState.direction = null;
        $fragmentState.support = null;
        $fragmentState.rotations = 0;
        $fragmentState.difficulty = 0;
        $fragmentState.modifiers = [];
    }
</script>

<Modal on:close="{hideFragmentModal}" z_index=1>
    <div slot="header">
        <div class="col">
            <h2>New Fragment</h2>
        </div>
    </div>
    <div slot="body" class="container">
        <div class="form">
            <label>Type
                <select required bind:this={inputType} bind:value={$fragmentState.type}
                        class="custom-select">
                    <option selected="selected" disabled value="">Choose...</option>
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
            {#if $fragmentState.type === "hybrid"}
                <label>Number of Movements
                    <select required bind:this={inputMovements} bind:value={$fragmentState.numberOfMovements}
                            class="custom-select">
                        <option selected="selected" disabled value>Choose...</option>
                        <option value="<6">&lt;6</option>
                        <option value="6-20">6-20</option>
                        <option value="21-30">21-30</option>
                        <option value=">30"> &gt;30 </option>
                    </select>
                </label>
                <label>Legs
                    <select required bind:this={inputLegs} bind:value={$fragmentState.legs} class="custom-select">
                        <option selected="selected" disabled value>Choose...</option>
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
                    <div slot="header" >
                        {modifier["category"]}
                    </div>
                    <div slot="body" >
                        {modifier.name}
                    </div>
                    <div slot="footer" >
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
        <!-- <div class="pair_acrobatics">
            <div>Pair acrobatics</div>
            <label>Direction
                <select required bind:this={inputDirection} bind:value={$fragmentState.direction}
                        class="custom-select">
                    <option selected="selected" disabled value>Choose...</option>
                    <option value="{0.1}">Heads up</option>
                    <option value="{0.2}">Legs up</option>
                </select>
            </label>

            <label>Support type
                <select required bind:this={inputSupport} bind:value={$fragmentState.support} class="custom-select">
                    <option selected="selected" disabled value>Choose...</option>
                    <option value="{0}">Lift</option>
                    <option value="{0.1}">Throw</option>
                </select>
            </label>

            <label>360° Rotations
                <input required bind:this={inputRotations} bind:value={$fragmentState.rotations} type="number"
                       min="0"
                       class="form-control">
            </label>
            <button on:click="{addAcrobaticModifier}" class="btn btn-outline-primary">Add additional acrobatic movement</button>
            <button on:click="{addAcrobaticModifier}" class="btn btn-outline-primary">Add acrobatic to fragment</button>
        </div>
        -->
    </div>
    <div slot="footer" class="footer">
        <button on:click="{saveFragment}" class="btn btn-primary">Save</button>
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
