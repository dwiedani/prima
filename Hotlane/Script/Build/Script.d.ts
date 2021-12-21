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
        constructor();
        create: (_event: Event) => void;
        update: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
