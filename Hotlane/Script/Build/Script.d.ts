declare namespace Script {
    import f = FudgeCore;
    class Agent extends f.Node {
        private agentName;
        private wheels;
        constructor(agentName: string);
        getName(): string;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class AgentComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        agentCanMove: boolean;
        agentSpeed: number;
        agentControl: f.Control;
        agentControlTurn: f.Control;
        maxTurnAngle: number;
        agentTransform: f.Matrix4x4;
        agentBody: f.ComponentRigidbody;
        constructor();
        create: () => void;
        update: (_event: Event) => void;
        destroy: () => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import f = FudgeCore;
    class RoadComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private transform;
        private startPosition;
        private roadLength;
        private speedInc;
        constructor();
        create: (_event: Event) => void;
        update: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class RoadControllerComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private roads;
        constructor();
        create: (_event: Event) => void;
        update: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
