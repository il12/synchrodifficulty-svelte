import {writable} from 'svelte/store';

export const modalStates = writable({
    fragmentModalVisibility: false,
    modifierModalVisibility: false,
    editFragmentModalVisibility: false
})

export const routineState = writable({
    type: "",
    name: "",
    country: "",
    competition: "",
    date: "",
    mark: "0.0",
    duration: "00:00",
    fragments: [],
    unique_modifiers: []
})

export const fragmentState = writable({
    type: "",
    startTime: null,
    endTime: null,
    duration: null,
    basicMark: 0,
    //ONLY FOR HYBRIDS
    level: null,
    numberOfMovements: null,
    legs: null,
    //Difficulty calculates WITH basicMark
    difficulty: 0,
    modifiers: []
})

export const acrobaticState = writable({
    basicMark: 0,
    direction: null,
    support: null,
    rotations: null,
    difficulty: 0,
    modifiers: []
})