declare namespace Script {
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
