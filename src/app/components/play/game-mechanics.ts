import { Icarta } from 'app/models/carta';
import { Subject } from 'rxjs';

export class GameMechanics {
    allTiles: Map<string, string[]>;
    cardAData: Icarta[];
    cardBData: Icarta[];
    ready = new Subject<boolean>();

    constructor() {
    }

    public setData(tiles: Map<string, string[]>) {
        this.allTiles = tiles;
    }

    public createRandomCards(imgsPerCard: number, levelFolder: string) {
        /**
         * Problems detected> 
         *  - I can select the same cart twice
         *  - I can select two cards that are the same meaning
         */
        // Here I have all the tiles in all_tiles in a MAP sorted by
        // folder_name: array of image names
        this.ready.next(false);
        const keys: string[] = Array.from(this.allTiles.keys());

        const totalFolders = this.allTiles.size;
        const pickRandom = (imgsPerCard * 2) - 1;
        // Here I'll store the picked ones
        const picked: Icarta[] = [];
        // Until double of number of tiles - 1, I pick
        for (let i = 0; i < pickRandom; i++) {
            let randomIndex = Math.floor(Math.random() * totalFolders);
            // adding just a security control
            if (randomIndex < 0 || randomIndex > (keys.length - 1)) {
                randomIndex = 0;
            };
            // Here I have a random folder
            const pickedKey = keys[randomIndex];
            const img = this.getRandomImgInFolder(pickedKey)
            if (!this.checkIfExist(picked, pickedKey, img)) {
                picked.push({
                    "folder": pickedKey,
                    "img": img,
                    "selected": false,
                    "levelFolder": levelFolder,
                });
            } else {
                i--;
            }
        }
        // I have already N -1
        const cardADataTmp = picked.splice(0, imgsPerCard);
        const cardBDataTmp = picked.slice(0, picked.length);
        // Then I select one of the already selected ones to put it
        // in the cardB array. But there is a mistake because if I do 
        // that then it's too easy to find as it is the same. I think I
        // should get a same one in another folder. 
        let randomIndex = Math.floor(Math.random() * imgsPerCard);
        cardADataTmp[randomIndex].solution = true;
        const new_folder = this.getFolderDifferentTo(keys, cardADataTmp[randomIndex].folder);
        cardBDataTmp.push({
            "folder": new_folder,
            "levelFolder": levelFolder,
            "img": cardADataTmp[randomIndex].img,
            "selected": false,
            "solution": true
        });
        // console.log('cardA: ', cardADataTmp)
        // console.log('cardB: ', cardBDataTmp)
        this.cardAData = this.getRandomArray(cardADataTmp, cardADataTmp.length);
        this.cardBData = this.getRandomArray(cardBDataTmp, cardBDataTmp.length);
        // console.log('cardA: ', this.cardAData)
        // console.log('cardB: ', this.cardBData)
        this.ready.next(true);
    }

    public getSelectedCardA(): Icarta {
        return this.getSelected(this.cardAData);
    }

    public getSelectedCardB(): Icarta {
        return this.getSelected(this.cardBData);
    }

    public isSolutionBetweenTiles(tile1: Icarta, tile2: Icarta) {
        return tile1.img === tile2.img;
    }

    public clearSelected() {
        for (const tile of this.cardAData) {
          tile.selected = false;
        }
        for (const tile of this.cardBData) {
          tile.selected = false;
        }
      }

    private checkIfExist(picked: Icarta[], folder: string, img: string) {
        for (const tile of picked) {
            if (tile.img === img) {
                return true;
            }
        }
        return false;
    }

    private getRandomImgInFolder(key: string): string {
        // I get a random img name of the array of namnes for 
        // this folder
        const imgArray = this.allTiles.get(key) as string[];
        const totalImgs = imgArray.length;
        const randomIndex = Math.floor(Math.random() * totalImgs);
        // security control
        if (randomIndex < 0 || randomIndex >= totalImgs) {
            return imgArray[0];
        } else {
            return imgArray[randomIndex];
        }
    }

    getFolderDifferentTo(keys, folderToAvoid) {
        let randomIndex = Math.floor(Math.random() * (keys.length - 1));
        if (keys[randomIndex] === folderToAvoid) {
            randomIndex = randomIndex + 1 % keys.length;
        }
        return keys[randomIndex];
    }

    private getRandomArray(arr, size) {
        const shuffled = arr.slice(0);
        let i = arr.length;
        let temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    }

    private getSelected(arrayTiles: Icarta[]): Icarta {
        for (const tile of arrayTiles) {
            if (tile.selected) {
                return tile;
            }
        }
        return null;
    }

}