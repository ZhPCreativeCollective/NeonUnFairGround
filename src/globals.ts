import { Room } from "colyseus.js"


export const BASIC_TRAP_RANGE = 5;
export const BASIC_HEALTHKIT_RANGE = 5;

export const backend_wss = "wss://??"
export let globalRooms: Room[] = []

interface leader {
    address: string,
    name: string,
    rooms: number,
    timer: number,
    deaths: number,
}
interface leaderboard_interface {
    room: leader[], timer: leader[], deaths: leader[]
}
export let leaderList: leaderboard_interface = {room: [], timer: [], deaths: []};
export let leaderStats: leader = {address: "", name: "", rooms: 0, timer: 0, deaths: 0};

export function setLeaderboardData(personal: leader, global: leaderboard_interface) {
    leaderList = global;
    leaderStats = personal;
}