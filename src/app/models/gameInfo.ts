export interface GameInfo {
    gameName: string;
    levels: GameLevel[]
}

export interface GameLevel {
    levelName: string;
    folderName: string;
    mapImagesByFolder: Map<string, string[]>;
}
