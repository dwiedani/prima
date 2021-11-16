declare namespace LaserLeague {
    import f = FudgeCore;
    class Agent extends f.Node {
        private agentName;
        hit: boolean;
        constructor(agentName: string);
        getName(): string;
    }
}
declare namespace LaserLeague {
    import f = FudgeCore;
    class AgentComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        agentCanMove: boolean;
        agentStartPosition: f.Vector3;
        agentMaxMovementSpeed: number;
        agentMaxTurnSpeed: number;
        agentControlForward: f.Control;
        agentControlTurn: f.Control;
        agentTransform: f.Matrix4x4;
        constructor();
        create: () => void;
        update: (_event: Event) => void;
        respawn: () => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class CustomComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        private static controller;
        private static instance;
        name: string;
        health: number;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace LaserLeague {
    import f = FudgeCore;
    class LaserComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        laserRotationSpeed: number;
        turnDirection: number;
        constructor();
        update: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
}
