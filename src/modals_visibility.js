import {modalStates} from "./stores";

export const hideModifierModal = function () {
    modalStates.update(state => {
        state.modifierModalVisibility = false;
        return state;
    })
}

export const showModifierModal = function () {
    window.scroll(0,0)
    modalStates.update(state => {
        state.modifierModalVisibility = true;
        return state;
    })
}

export const hideFragmentModal = function () {
    modalStates.update(state => {
        state.fragmentModalVisibility = false;
        return state;
    })
}

export const showFragmentModal = function () {
    window.scroll(0,0)
    modalStates.update(state => {
        state.fragmentModalVisibility = true
        console.log(state);
        return state;
    })
}

export const showEditFragmentModal = function(){
    window.scroll(0,0)
    modalStates.update(state => {
        state.editFragmentModalVisibility = true
        console.log(state);
        return state;
    })
}


export const hideEditFragmentModal = function(){
    modalStates.update(state => {
        state.editFragmentModalVisibility = false;
        console.log(state);
        return state;
    })
}