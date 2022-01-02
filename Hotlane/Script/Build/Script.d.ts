declare namespace Script {
    import f = FudgeCore;
    class Agent extends f.Node {
        constructor(name: string);
    }
}
declare namespace Script {
    import f = FudgeCore;
    class AgentComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        private canMove;
        private speed;
        private control;
        private body;
        private zPosition;
        constructor();
        create: () => void;
        update: (_event: Event) => void;
        destroy: () => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class CameraComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        agent: f.Node;
        private transform;
        offset: f.Vector3;
        rotation: f.Vector3;
        constructor();
        update: (_event: Event) => void;
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
declare namespace Script {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        private static controller;
        private static instance;
        score: number;
        startTime: number;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import f = FudgeCore;
    class Obstacle extends f.Node {
        constructor(name: string, position: number, width: number);
    }
}
declare namespace Script {
    import f = FudgeCore;
    class RoadComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private transform;
        private startPosition;
        private roadWidth;
        private roadLength;
        private speedInc;
        private maxSpeed;
        private obstacleWidthMin;
        private spawnTrigger;
        constructor();
        create: (_event: Event) => void;
        update: (_event: Event) => void;
        spawnObstacle(): void;
        reset(): void;
        hndEvent: (_event: Event) => void;
    }
}
