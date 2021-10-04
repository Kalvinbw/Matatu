export default class Game {
    constructor(name, host) {
        this.host_id = host;
        this.game_name = name;
        this.players = [host];
    }
}