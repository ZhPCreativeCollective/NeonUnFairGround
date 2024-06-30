export const choosenGreeting = Math.floor(Math.random() * (6 - 1) + 1)

export let dialogGreeting: string[] = [
    "Welcome to Neon UnFair Ground!",
    "Welcome to our\nEXPLOSIVE show!",
    "Hello and welcome\nto the explosive show!",
    "Grenade roulette!\nGenius, isn't it?",
    "A test\nof luck and strategy!",
    "An old game with\nan EXPLOSIVE twist!",
]

export let dialogDamagetoDealer: string[] = [
    "Ah, curses!\nMy new suit!",
    "Damn it!",
    "It's a gambit. I don't\nexpect you to understand.",
    "Today is your lucky day,\nalright.",
    "I can handle worse.",
    "MORE!",
    "Gloat while you still can.",
    "I allowed that.",
    "Maybe next time I will\nchoose a different weapon…",
    "RIVETING EXPERIENCE!",
    "COME ON,\nGIVE ME ALL YOU GOT!",
    "You will be paying for\napparel damage, you know that?",
]

export let dialogDamagetoDealerSelf: string[] = [
    "It was… Planned!",
    "WITNESS ME!",
    "We all make bad\ndecisions sometimes.",
    "My plans are\nincomprehensible to you.",
    "That's what\ncomes from taking risks.",
]

export let dialogDamagetoPlayer: string[] = [
    "Ha!",
    "Here, catch!",
    "Here it is…\nThe real show!",
    "Are you sure you\nhave what it takes?",
    "In your face!",
    "Here, here…\nDon't be so sad.",
    "As expected.",   
]

export let dialogDamagetoPlayerSelf: string[] = [
    "You knew the risks.",
    "Everything comes\nat a price.",
    "Ha! Perhaps,\ntry one more time?",
    "How unlucky, truly!",
    "Unforgettable\nperformance!",
    "Was it worth it,\nreally?",
    "It seems your luck\nrun dry tonight!",
    "Now imagine how\nit feels working my job.",
]

export let dialogPlayerLost: string[] = [
    "Again, everything\nwent as planned.",
    "This victory was\ncalculated.",
    "A taste of defeat\nwill only make\na victory sweeter.",
    "You can always try\nanother time.",
    "But it was refreshing,\ndon't you agree?",
    "Truly, I have the best\njob in the world.",
    "Let me guess,\nhungry for more?",
]

export let dialogPlayerWon: string[] = [
    "Oh, come on!",
    "I'm sure you\ncheated somehow.",
    "This time you won.\nDon't expect me to go easy on you next time.",
    "Such as fate, I guess.",
    "Rematch!\nI demand a rematch!",
    "Perhaps you\nare learning something…",
    "Tsk.",
    "This time… Only this time!",
]

export function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

