export const calculateHybridLevel = function(fragment){
    return Number(fragment.duration) < 16 ? (Number(fragment.duration) < 10 ? 'short' : 'medium') : 'long';
}
export const calculateFragmentDuration = function(fragment){
    if(fragment.startTime && fragment.endTime) {
        const startTimeInSeconds = Number(fragment.startTime.split(':')[0]) * 60 + Number(fragment.startTime.split(':')[1])
        const endTimeInSeconds = Number(fragment.endTime.split(':')[0]) * 60 + Number(fragment.endTime.split(':')[1])
        return endTimeInSeconds - startTimeInSeconds;
    }
}

export const calculateFragmentBasicMark = function(fragment) {
    if (fragment.type === 'transition') {
        return 0.1;
    } else if (fragment.type === 'hybrid') {
        let legs = fragment.legs;
        return legs === "1" ? 0.2 : 0.3;
    }
}

export const excludeNonUniqueModifiers = function(fragment){
    let modifiersArray = fragment.modifiers.filter(item=>{
        return !item.unique
    });
    let uniqueModifiersArray = Array.from(new Set((fragment.modifiers.filter(item=>{
        return item.unique && !item.multiplier
    })).map(item=>JSON.stringify(item)))).map(item=>JSON.parse(item));
    let multipliers = fragment.modifiers.filter(item=>{
        return item.multiplier
    });
    return modifiersArray.concat(uniqueModifiersArray).concat(multipliers);
}

export const calculateFragmentDifficulty = function (fragment,programType) {
    let modifiersArray = fragment.modifiers.filter(item=>{
        return !item.unique
    });
    let uniqueModifiersArray = Array.from(new Set((fragment.modifiers.filter(item=>{
        return item.unique && !item.multiplier
    })).map(item=>JSON.stringify(item)))).map(item=>JSON.parse(item));
    let multipliers = fragment.modifiers.filter(item=>{
        return item.multiplier
    });

    let newModifiers = modifiersArray.concat(uniqueModifiersArray).concat(multipliers);

    let modifiersMark = modifiersArray.reduce((accumulator,currentValue)=>{
        return accumulator+=currentValue.values[programType];
    }, 0);
    let uniqueModifiersMark = uniqueModifiersArray.reduce((accumulator,currentValue)=>{
        return accumulator+=currentValue.values[programType];
    }, 0);

    let mark = Number(fragment.basicMark) + Number(modifiersMark) + Number(uniqueModifiersMark);
    if(multipliers.length !== 0){
        let multipliersArray = multipliers.map((item)=>item.values[programType]);
        for(let multiplier of multipliersArray){
            mark*=multiplier;
        }
    }

    return Number(mark).toFixed(2);
};

export const calculateRoutineDifficulty = function (routine) {
    let overallDifficulty = routine.hybridsScore ? Number(routine.hybridsScore) : 0;
    if(routine.fragments.length !== 0 ) {
        routine.fragments.forEach((fragment) => {
            overallDifficulty += Number(fragment.difficulty);
        }, 0)
    }
    if(routine.unique_modifiers.length !== 0){
        routine.unique_modifiers.forEach((item)=>{
            overallDifficulty += Number(item.values[routine.type])
        })
    }
    return Number(overallDifficulty).toFixed(2)
}

export const calculateRoutineTime = function (program) {
    let overallTime = program.fragments.reduce((accumulator,fragment)=>{
        return accumulator+=Number(fragment.duration);
    },0)
    let seconds = String(overallTime % 60).padStart(2,'0');
    let minutes = String(Math.floor(overallTime/60)).padStart(2,'0');
    return `${minutes}:${seconds}`
}

export const calculateHybridTime = function(program){
    let overallTime = program.fragments.reduce((accumulator,fragment)=>{
        return accumulator+=Number(fragment.duration);
    },0);

    let hybrids = program.fragments.filter((item)=>item.type === "hybrid")

    let hybridsSeconds = hybrids.reduce((accumulator,fragment)=>{
        return accumulator+=Number(fragment.duration);
    },0);

    let seconds = String(hybridsSeconds % 60).padStart(2,'0');
    let minutes = String(Math.floor(hybridsSeconds/60)).padStart(2,'0');
    let hybridsTime = `${minutes}:${seconds}`

    let hybridsPercent = hybridsSeconds/overallTime;

    let hybridsScore = hybridsPercent*5;

    return {hybridsTime, hybridsPercent, hybridsScore};
}

export const calculateAcrobaticBasicMark = function(acrobatic){
    return Number(acrobatic.type)+Number(acrobatic.direction);
}

export const calculateAcrobaticDifficulty = function(acrobatic){
    let modifiersMark = acrobatic.modifiers.reduce((accumulator,currentValue)=>{
        return accumulator+=currentValue.value;
    }, 0);
    return acrobatic.basicMark+modifiersMark+Number(acrobatic.rotations)*0.1;
}