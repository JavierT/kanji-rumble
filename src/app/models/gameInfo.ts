export interface GameInfo {
    gameName: string;
    levels: GameLevel[]
}

export interface GameLevel {
    levelId: number;
    levelName: string;
    folderName: string;
    mapImagesByFolder: Map<string, string[]>;
    multiplier: number;
}
