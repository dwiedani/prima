namespace Script {
    import f = FudgeCore;
    import fui = FudgeUserInterface;
  
    export class GameState extends f.Mutable {
      private static controller: fui.Controller;
      private static instance: GameState;
      public name: string = "LaserLeague";
      public health: number = 100;
  
      private constructor() {
        super();
        let domHud: HTMLDivElement = document.querySelector("#ui");
        GameState.instance = this;
        GameState.controller = new fui.Controller(this, domHud);
        console.log("Hud-Controller", GameState.controller);
      }
  
      public static get(): GameState {
        return GameState.instance || new GameState();
      }
  
      protected reduceMutator(_mutator: f.Mutator): void {/* */ }
    }
  }